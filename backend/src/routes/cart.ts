import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = Router();

// Toutes les routes du panier nécessitent l'utilisateur connecté
router.use(protect);

// Récupérer ou vider le panier
router.route('/')
  .get(getCart)
  .delete(clearCart);

// Ajouter un item au panier
router.post('/items', addToCart);

// Mettre à jour ou supprimer un item spécifique
router.route('/items/:itemId')
  .put(updateCartItem)
  .delete(removeFromCart);

export default router;
