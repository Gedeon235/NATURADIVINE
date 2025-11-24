import { Router } from 'express';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoriesTree,
  getFeaturedCategories,
  reorderCategories
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', getCategories);
router.get('/tree', getCategoriesTree);
router.get('/featured', getFeaturedCategories);
router.get('/:idOrSlug', getCategory);

// Routes protégées (Admin uniquement)
router.use(protect);
router.use(authorize('admin'));

// Création, modification et suppression
router.post('/', createCategory);
router.put('/reorder', reorderCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
