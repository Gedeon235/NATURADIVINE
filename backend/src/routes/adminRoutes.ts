import { Router } from 'express';
import {
  getDashboard,
  getLowStockProducts,
  getRecentActivities
} from '../controllers/adminController';
import { protect, admin } from '../middleware/auth';

const router = Router();

router.get('/dashboard', protect, admin, getDashboard);
router.get('/low-stock', protect, admin, getLowStockProducts);
router.get('/activities', protect, admin, getRecentActivities);

export default router;
