import { Request, Response } from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Beautician from '../models/Beautician.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendAppointmentConfirmation } from '../utils/emailService.js';

// Types pour les objets peuplés
interface PopulatedClient {
  _id: string;
  name: string;
  email: string;
}

interface PopulatedService {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

interface PopulatedBeautician {
  _id: string;
  name: string;
}

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, beautician, date } = req.query;
    
    let query: any = {};
    
    if (status) query.status = status;
    if (beautician) query.beautician = beautician;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('client', 'name email phone')
      .populate('service', 'name category duration price')
      .populate('beautician', 'name specialties')
      .sort({ date: 1, timeSlot: 1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({ client: req.user?._id })
      .populate('service', 'name category price image')
      .populate('beautician', 'name avatar')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('service', 'name category duration price')
      .populate('beautician', 'name specialties phone avatar');

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé',
      });
      return;
    }

    // Check if user is authorized to view this appointment
    if (req.user?.role !== 'admin' && appointment.client._id.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à ce rendez-vous',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serviceId, beauticianId, date, timeSlot, notes } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service non trouvé',
      });
      return;
    }

    // Check if beautician exists
    const beautician = await Beautician.findById(beauticianId);
    if (!beautician) {
      res.status(404).json({
        success: false,
        message: 'Esthéticienne non trouvée',
      });
      return;
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      beautician: beauticianId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      res.status(400).json({
        success: false,
        message: 'Ce créneau horaire n\'est pas disponible',
      });
      return;
    }

    const appointment = await Appointment.create({
      client: req.user?._id,
      service: serviceId,
      beautician: beauticianId,
      date: new Date(date),
      timeSlot,
      duration: service.duration,
      price: service.price,
      notes,
      status: 'pending'
    });

    // Récupérer les données complètes pour l'email avec typage correct
    const appointmentWithDetails = await Appointment.findById(appointment._id)
      .populate<{ client: PopulatedClient }>('client', 'name email')
      .populate<{ service: PopulatedService }>('service')
      .populate<{ beautician: PopulatedBeautician }>('beautician', 'name');

    // Envoyer l'email de confirmation de façon asynchrone
    if (appointmentWithDetails && appointmentWithDetails.client) {
      const client = appointmentWithDetails.client as PopulatedClient;
      const service = appointmentWithDetails.service as PopulatedService;
      const beautician = appointmentWithDetails.beautician as PopulatedBeautician;

      sendAppointmentConfirmation(
        appointmentWithDetails,
        client,
        service,
        beautician
      ).then(success => {
        if (success) {
          console.log(`✅ Email de confirmation de rendez-vous envoyé à ${client.email}`);
        } else {
          console.log(`❌ Échec de l'envoi de l'email de confirmation à ${client.email}`);
        }
      }).catch(error => {
        console.error('❌ Erreur envoi confirmation rendez-vous:', error);
      });
    }

    await appointment.populate('service', 'name category');
    await appointment.populate('beautician', 'name');

    res.status(201).json({
      success: true,
      message: 'Rendez-vous créé avec succès. Une confirmation a été envoyée par email.',
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('client', 'name email')
     .populate('service', 'name')
     .populate('beautician', 'name');

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Rendez-vous ${status}`,
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé',
      });
      return;
    }

    // Check if user is authorized to cancel this appointment
    if (req.user?.role !== 'admin' && appointment.client.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler ce rendez-vous',
      });
      return;
    }

    // Check if appointment can be cancelled (at least 2 hours before)
    const appointmentTime = new Date(appointment.date);
    const now = new Date();
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 2 && req.user?.role !== 'admin') {
      res.status(400).json({
        success: false,
        message: 'Impossible d\'annuler un rendez-vous moins de 2 heures à l\'avance',
      });
      return;
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Rendez-vous annulé avec succès',
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get available time slots
// @route   GET /api/appointments/availability
// @access  Public
export const getAvailableTimeSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, beauticianId, serviceId } = req.query;

    if (!date || !beauticianId) {
      res.status(400).json({
        success: false,
        message: 'La date et l\'esthéticienne sont requises',
      });
      return;
    }

    const selectedDate = new Date(date as string);
    const beautician = await Beautician.findById(beauticianId);
    
    if (!beautician) {
      res.status(404).json({
        success: false,
        message: 'Esthéticienne non trouvée',
      });
      return;
    }

    // Get day of week
    const dayOfWeek = selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const workingHours = beautician.workingHours[dayOfWeek as keyof typeof beautician.workingHours];

    if (!workingHours.available) {
      res.status(200).json({
        success: true,
        data: [],
        message: 'L\'esthéticienne ne travaille pas ce jour'
      });
      return;
    }

    // Generate time slots
    const timeSlots = [];
    const start = new Date(selectedDate);
    
    // Parse working hours with proper type safety
    const startParts = workingHours.start.split(':').map(Number);
    const endParts = workingHours.end.split(':').map(Number);
    
    const startHour = startParts[0];
    const startMinute = startParts[1];
    const endHour = endParts[0];
    const endMinute = endParts[1];

    // Validate that we have valid numbers
    if (
      startHour === undefined || startMinute === undefined ||
      endHour === undefined || endMinute === undefined
    ) {
      res.status(500).json({
        success: false,
        message: 'Format d\'heure de travail invalide',
      });
      return;
    }

    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);

    // Service duration (default 60 minutes)
    let duration = 60;
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) duration = service.duration;
    }

    while (start < end) {
      const timeSlot = start.toTimeString().slice(0, 5);
      
      // Check if this time slot is available
      const existingAppointment = await Appointment.findOne({
        beautician: beauticianId,
        date: selectedDate,
        timeSlot,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (!existingAppointment) {
        timeSlots.push(timeSlot);
      }

      start.setMinutes(start.getMinutes() + duration);
    }

    res.status(200).json({
      success: true,
      data: timeSlots,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};