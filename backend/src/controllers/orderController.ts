import { Request, Response } from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendOrderConfirmation, notifyAdminNewOrder } from '../utils/emailService.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Create new order from cart - VERSION SIMPLIFIÉE
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user?._id });
    
    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Le panier est vide',
      });
      return;
    }

    // Get all product details separately
    const productIds = cart.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map for quick access
    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product._id.toString(), product);
    });

    // Check stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = productMap.get(item.product.toString());
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé',
        });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.name}`,
        });
        return;
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: item.price,
        name: product.name,
        image: product.images[0] || ''
      });
    }

    // Calculate prices
    const itemsPrice = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 100000 ? 0 : 5000;
    const taxPrice = Math.round(itemsPrice * 0.18);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate('user', 'name email phone');
    await order.populate('items.product', 'name images');

    // ENVOYER LA CONFIRMATION DE COMMANDE AU CLIENT
    sendOrderConfirmation(order, req.user).then(success => {
      if (success) {
        console.log(`✅ Email de confirmation de commande envoyé à ${req.user?.email}`);
      } else {
        console.log(`❌ Échec de l'envoi de l'email de confirmation à ${req.user?.email}`);
      }
    }).catch(error => {
      console.error('❌ Erreur envoi confirmation commande:', error);
    });

    // NOTIFIER L'ADMIN DE LA NOUVELLE COMMANDE
    notifyAdminNewOrder(order, req.user).then(success => {
      if (success) {
        console.log('✅ Notification admin envoyée');
      } else {
        console.log('❌ Échec de la notification admin');
      }
    }).catch(error => {
      console.error('❌ Erreur notification admin:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès. Une confirmation a été envoyée par email.',
      data: order,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande',
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée',
      });
      return;
    }

    // Check if user is authorized to view this order
    if (req.user?.role !== 'admin' && order.user._id.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette commande',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande',
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    
    let query: any = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      data: orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        orderStatus,
        ...(orderStatus === 'delivered' && { 
          isDelivered: true, 
          deliveredAt: new Date() 
        })
      },
      { new: true, runValidators: true }
    )
    .populate('user', 'name email phone')
    .populate('items.product', 'name images');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Statut de commande mis à jour: ${orderStatus}`,
      data: order,
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut de la commande',
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus,
        ...(paymentStatus === 'paid' && { 
          isPaid: true, 
          paidAt: new Date() 
        })
      },
      { new: true, runValidators: true }
    )
    .populate('user', 'name email phone')
    .populate('items.product', 'name images');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Statut de paiement mis à jour: ${paymentStatus}`,
      data: order,
    });
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut de paiement',
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée',
      });
      return;
    }

    // Check if user is authorized to cancel this order
    if (req.user?.role !== 'admin' && order.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette commande',
      });
      return;
    }

    // Check if order can be cancelled
    if (order.orderStatus !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Impossible d\'annuler une commande déjà traitée',
      });
      return;
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Commande annulée avec succès',
      data: order,
    });
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la commande',
    });
  }
};