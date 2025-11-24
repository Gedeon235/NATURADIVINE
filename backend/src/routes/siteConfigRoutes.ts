import { Router } from 'express';
import { getConfig, updateConfig, getMaintenanceMode } from '../controllers/siteConfigController';
import { protect, admin } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', getConfig);
router.get('/maintenance', getMaintenanceMode);

// Routes protégées (admin)
router.put('/', protect, admin, updateConfig);

export default router;
