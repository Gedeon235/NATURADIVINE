import { Router } from 'express';
import {
  subscribe,
  unsubscribe,
  unsubscribeByToken,
  updatePreferences,
  getSubscriptionStatus,
  getSubscribers,
  getNewsletterStats
} from '../controllers/newsletterController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Routes publiques
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/unsubscribe/:token', unsubscribeByToken);
router.put('/preferences', updatePreferences);
router.get('/status/:email', getSubscriptionStatus);

// Routes admin (protégées)
router.use(protect);
router.use(authorize('admin'));

router.get('/subscribers', getSubscribers);
router.get('/stats', getNewsletterStats);

export default router;
