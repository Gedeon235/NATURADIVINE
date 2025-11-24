// controllers/adminStatsController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Appointment from '../models/Appointment.js';

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Fetching admin statistics...');

    // 1. Nombre total de ventes (commandes)
    const totalSales = await Order.countDocuments();
    console.log('Total sales:', totalSales);

    // 2. Chiffre d'affaires total (uniquement commandes complétées)
    const totalRevenueResult = await Order.aggregate([
      { 
        $match: { 
          status: { $in: ['paid', 'delivered', 'completed'] } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$totalAmount' } 
        } 
      }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    console.log('Total revenue:', totalRevenue);

    // 3. Nombre total d'utilisateurs
    const totalUsers = await User.countDocuments();
    console.log('Total users:', totalUsers);

    // 4. Nombre de nouveaux utilisateurs ce mois-ci
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    console.log('New users this month:', newUsersThisMonth);

    // 5. Nombre total de rendez-vous
    const totalAppointments = await Appointment.countDocuments();
    console.log('Total appointments:', totalAppointments);

    // 6. Produits populaires (top 5)
    const popularProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: '$_id',
          name: '$product.name',
          totalSold: 1,
          revenue: 1,
          image: '$product.image'
        }
      }
    ]);
    console.log('Popular products found:', popularProducts.length);

    // 7. Statistiques des commandes par statut
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('Orders by status:', ordersByStatus);

    // 8. Produits en rupture de stock
    const outOfStockProducts = await Product.countDocuments({ stock: { $lte: 0 } });
    console.log('Out of stock products:', outOfStockProducts);

    // 9. Produits avec stock faible (moins de 10)
    const lowStockProducts = await Product.countDocuments({ 
      stock: { $lte: 10, $gt: 0 } 
    });
    console.log('Low stock products:', lowStockProducts);

    // 10. Revenu du mois en cours
    const currentMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $in: ['paid', 'delivered', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const currentMonthRevenueAmount = currentMonthRevenue[0]?.total || 0;
    console.log('Current month revenue:', currentMonthRevenueAmount);

    // 11. Rendez-vous par statut
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('Appointments by status:', appointmentsByStatus);

    // 12. Commandes en attente de traitement
    const pendingOrders = await Order.countDocuments({ 
      status: { $in: ['pending', 'confirmed'] } 
    });

    // 13. Rendez-vous à venir (aujourd'hui et futurs)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingAppointments = await Appointment.countDocuments({
      date: { $gte: today },
      status: 'confirmed'
    });

    // Formatage de la réponse
    const stats = {
      success: true,
      data: {
        overview: {
          totalSales,
          totalRevenue,
          totalUsers,
          newUsersThisMonth,
          totalAppointments,
          currentMonthRevenue: currentMonthRevenueAmount,
          outOfStockProducts,
          lowStockProducts,
          pendingOrders,
          upcomingAppointments
        },
        products: {
          popular: popularProducts
        },
        orders: {
          byStatus: ordersByStatus
        },
        appointments: {
          byStatus: appointmentsByStatus
        },
        timestamps: {
          generatedAt: new Date().toISOString(),
          period: {
            startOfMonth: startOfMonth.toISOString(),
            current: new Date().toISOString()
          }
        }
      }
    };

    console.log('Admin stats generated successfully');
    res.status(200).json(stats);

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get admin dashboard data (données pour le tableau de bord)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Fetching admin dashboard data...');

    // Dernières commandes (10 plus récentes)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .select('orderNumber totalAmount status createdAt');

    // Derniers utilisateurs inscrits (10 plus récents)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt role');

    // Derniers rendez-vous (10 plus récents)
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('client', 'name email phone')
      .populate('service', 'name price duration')
      .populate('beautician', 'name specialty')
      .select('date time status notes');

    // Produits en rupture de stock
    const outOfStockProducts = await Product.find({ stock: { $lte: 0 } })
      .select('name image stock price')
      .limit(10);

    // Produits avec stock faible
    const lowStockProducts = await Product.find({ 
      stock: { $lte: 10, $gt: 0 } 
    })
    .select('name image stock price')
    .limit(10);

    // Récupérer les stats globales aussi
    const totalRevenueResult = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'delivered', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const dashboardData = {
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          totalUsers,
          revenueFormatted: `${totalRevenue.toLocaleString('fr-FR')} FCFA`
        },
        recentActivity: {
          orders: recentOrders,
          users: recentUsers,
          appointments: recentAppointments
        },
        alerts: {
          outOfStock: outOfStockProducts,
          lowStock: lowStockProducts,
          totalAlerts: outOfStockProducts.length + lowStockProducts.length
        }
      }
    };

    console.log('Admin dashboard data generated successfully');
    res.status(200).json(dashboardData);

  } catch (error: any) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tableau de bord',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};