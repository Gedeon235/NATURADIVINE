import { Router } from 'express';
import {
  createReview,
  getReviewsByProduct,
  getReviewsByService,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews,
  getAllReviews,
  updateReviewStatus
} from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/product/:productId', getReviewsByProduct);
router.get('/service/:serviceId', getReviewsByService);

// Routes protégées pour utilisateurs connectés
router.use(protect);

router.get('/my-reviews', getMyReviews);
router.post('/', createReview);
router.put('/:id/helpful', markHelpful);
router.route('/:id')
  .put(updateReview)
  .delete(deleteReview);

// Routes admin
router.use(authorize('admin'));
router.get('/', getAllReviews);
router.put('/:id/status', updateReviewStatus);

export default router;
