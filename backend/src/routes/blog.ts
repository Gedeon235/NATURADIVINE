import { Router } from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  addComment,
  getBlogPostsByAuthor,
  getBlogStats
} from '../controllers/blogController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', getBlogPosts);
router.get('/:idOrSlug', getBlogPost);
router.get('/author/:authorId', getBlogPostsByAuthor);

// Routes protégées (utilisateur connecté)
router.use(protect);

router.put('/:id/like', likeBlogPost);
router.post('/:id/comments', addComment);

// Routes admin
router.use(authorize('admin'));

router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);
router.get('/admin/stats', getBlogStats);

export default router;
