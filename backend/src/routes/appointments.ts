import { Router } from 'express';
import {
  getAppointments,
  getMyAppointments,
  getAppointment,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableTimeSlots
} from '../controllers/appointmentController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Créneaux disponibles
router.get('/availability', getAvailableTimeSlots);

// Mes rendez-vous uniquement (utilisateur connecté)
router.get('/my-appointments', protect, getMyAppointments);

// Liste + création
router.route('/')
  .get(protect, authorize('admin'), getAppointments)
  .post(protect, createAppointment);

// Détails rendez-vous
router.route('/:id')
  .get(protect, getAppointment);

// Mettre à jour le statut
router.put('/:id/status', protect, authorize('admin'), updateAppointmentStatus);

// Annuler un rendez-vous
router.put('/:id/cancel', protect, cancelAppointment);

export default router;
