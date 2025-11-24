import { Router } from 'express';
import { getAdminStats, getAdminDashboard } from '../controllers/adminStatsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Toutes les routes admin nécessitent l'authentification et le rôle admin
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/stats - Statistiques détaillées
router.get('/stats', getAdminStats);

// GET /api/admin/dashboard - Données pour le tableau de bord
router.get('/dashboard', getAdminDashboard);

export default router;
