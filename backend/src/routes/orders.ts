import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Routes protégées pour tous les utilisateurs connectés
router.use(protect);

router.get('/my-orders', getMyOrders);
router.post('/', createOrder);

router.route('/:id')
  .get(getOrder)
  .put(cancelOrder); // On peut combiner si nécessaire

// Routes admin
router.get('/', authorize('admin'), getOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.put('/:id/payment', authorize('admin'), updatePaymentStatus);

export default router;
