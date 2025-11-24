import { Request, Response } from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Beautician from '../models/Beautician.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Exécuter toutes les requêtes en parallèle pour meilleures performances
    const [
      totalAppointments,
      todayAppointments,
      weeklyAppointments,
      monthlyAppointments,
      yearlyAppointments,
      appointmentStatusCounts,
      totalRevenue,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      totalClients,
      totalServices,
      totalBeauticians,
      totalProducts,
      lowStockProducts,
      recentAppointments,
      recentReviews,
      beauticianPerformance
    ] = await Promise.all([
      // Statistiques des rendez-vous
      Appointment.countDocuments(),
      Appointment.countDocuments({ 
        date: { $gte: startOfToday } 
      }),
      Appointment.countDocuments({ 
        date: { $gte: startOfWeek } 
      }),
      Appointment.countDocuments({ 
        date: { $gte: startOfMonth } 
      }),
      Appointment.countDocuments({ 
        date: { $gte: startOfYear } 
      }),

      // Comptes par statut
      Appointment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Revenus
      Appointment.aggregate([
        { $match: { status: { $in: ['completed', 'confirmed'] } } },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' }
          }
        }
      ]),
      Appointment.aggregate([
        { 
          $match: { 
            status: { $in: ['completed', 'confirmed'] },
            date: { $gte: startOfToday }
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' }
          }
        }
      ]),
      Appointment.aggregate([
        { 
          $match: { 
            status: { $in: ['completed', 'confirmed'] },
            date: { $gte: startOfWeek }
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' }
          }
        }
      ]),
      Appointment.aggregate([
        { 
          $match: { 
            status: { $in: ['completed', 'confirmed'] },
            date: { $gte: startOfMonth }
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' }
          }
        }
      ]),
      Appointment.aggregate([
        { 
          $match: { 
            status: { $in: ['completed', 'confirmed'] },
            date: { $gte: startOfYear }
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' }
          }
        }
      ]),

      // Comptes généraux
      User.countDocuments({ role: 'client' }),
      Service.countDocuments({ isActive: true }),
      Beautician.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ 
        stock: { $lte: 10 }, // Produits avec stock <= 10
        isActive: true 
      }),

      // Derniers rendez-vous
      Appointment.find()
        .populate('client', 'name email')
        .populate('service', 'name')
        .populate('beautician', 'name')
        .sort({ createdAt: -1 })
        .limit(5),

      // Derniers avis
      Review.find()
        .populate('client', 'name')
        .populate('service', 'name')
        .populate('beautician', 'name')
        .sort({ createdAt: -1 })
        .limit(5),

      // Performance des esthéticiennes
      Appointment.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$beautician',
            totalAppointments: { $sum: 1 },
            totalRevenue: { $sum: '$price' },
            averageRating: { $avg: '$rating' }
          }
        },
        {
          $lookup: {
            from: 'beauticians',
            localField: '_id',
            foreignField: '_id',
            as: 'beautician'
          }
        },
        { $unwind: '$beautician' },
        {
          $project: {
            name: '$beautician.name',
            totalAppointments: 1,
            totalRevenue: 1,
            averageRating: { $ifNull: ['$averageRating', 0] }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Transformer les données de revenus
    const transformRevenue = (revenueData: any[]) => 
      revenueData.length > 0 ? revenueData[0].total : 0;

    // Transformer les données de statut
    const statusCounts = appointmentStatusCounts.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        // Statistiques principales
        overview: {
          totalAppointments,
          todayAppointments,
          weeklyAppointments,
          monthlyAppointments,
          yearlyAppointments,
          totalClients,
          totalServices,
          totalBeauticians,
          totalProducts
        },

        // Revenus
        revenue: {
          total: transformRevenue(totalRevenue),
          today: transformRevenue(todayRevenue),
          weekly: transformRevenue(weeklyRevenue),
          monthly: transformRevenue(monthlyRevenue),
          yearly: transformRevenue(yearlyRevenue)
        },

        // Statuts des rendez-vous
        appointmentStatus: {
          pending: statusCounts.pending || 0,
          confirmed: statusCounts.confirmed || 0,
          completed: statusCounts.completed || 0,
          cancelled: statusCounts.cancelled || 0
        },

        // Alertes
        alerts: {
          lowStockProducts,
          pendingAppointments: statusCounts.pending || 0
        },

        // Données récentes
        recentAppointments,
        recentReviews,

        // Performance
        beauticianPerformance,

        // Graphiques (données pour les 6 derniers mois)
        monthlyStats: await getMonthlyStats(),
        popularServices: await getPopularServices()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Fonction pour obtenir les statistiques mensuelles
const getMonthlyStats = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return await Appointment.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        status: { $in: ['completed', 'confirmed'] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        appointments: { $sum: 1 },
        revenue: { $sum: '$price' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $limit: 6
    }
  ]);
};

// Fonction pour obtenir les services populaires
const getPopularServices = async () => {
  return await Appointment.aggregate([
    { $match: { status: { $in: ['completed', 'confirmed'] } } },
    {
      $group: {
        _id: '$service',
        count: { $sum: 1 },
        revenue: { $sum: '$price' }
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service'
      }
    },
    { $unwind: '$service' },
    {
      $project: {
        name: '$service.name',
        count: 1,
        revenue: 1
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
};

// @desc    Get low stock products
// @route   GET /api/admin/low-stock
// @access  Private/Admin
export const getLowStockProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
      isActive: true
    }).sort({ stock: 1 });

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/admin/activities
// @access  Private/Admin
export const getRecentActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const recentAppointments = await Appointment.find()
      .populate('client', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const recentReviews = await Review.find()
      .populate('client', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: {
        appointments: recentAppointments,
        reviews: recentReviews
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};