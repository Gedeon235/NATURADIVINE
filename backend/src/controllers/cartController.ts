import { Request, Response } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.user?._id }).populate('items.product', 'name price images stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user?._id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({
        success: false,
        message: 'Stock insuffisant',
      });
      return;
    }

    let cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
      cart = await Cart.create({ 
        user: req.user?._id, 
        items: [] 
      });
    }

    // Check if product already in cart - with proper typing
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity - using non-null assertion since we verified the index exists
      const existingItem = cart.items[existingItemIndex];
      if (!existingItem) {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la mise à jour du panier',
        });
        return;
      }

      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stock) {
        res.status(400).json({
          success: false,
          message: 'Quantité demandée dépasse le stock disponible',
        });
        return;
      }

      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    
    // Populate with proper typing
    const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Produit ajouté au panier',
      data: populatedCart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
      return;
    }

    const itemIndex = cart.items.findIndex(item => {
      if (!item._id) {
        return false;
      }
      return item._id.toString() === itemId;
    });

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Article non trouvé dans le panier',
      });
      return;
    }

    // Get the item safely
    const cartItem = cart.items[itemIndex];
    if (!cartItem) {
      res.status(404).json({
        success: false,
        message: 'Article non trouvé dans le panier',
      });
      return;
    }

    // Check product stock
    const product = await Product.findById(cartItem.product);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
      return;
    }

    if (quantity > product.stock) {
      res.status(400).json({
        success: false,
        message: 'Stock insuffisant',
      });
      return;
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      cartItem.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Panier mis à jour',
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
      return;
    }

    // Safe filtering with proper null checking
    cart.items = cart.items.filter(item => {
      if (!item._id) {
        return true; // Keep items without _id (shouldn't happen, but safe guard)
      }
      return item._id.toString() !== itemId;
    });

    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Article retiré du panier',
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    
    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Panier non trouvé',
      });
      return;
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Panier vidé',
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};