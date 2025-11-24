import { Request, Response, NextFunction } from 'express';
import SiteConfig from '../models/SiteConfig.js';

export const checkMaintenanceMode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ne pas bloquer les routes de configuration en mode maintenance
    if (req.path.startsWith('/api/config') || req.path.startsWith('/api/auth/login')) {
      return next();
    }

    const config = await SiteConfig.findOne();
    
    if (config?.maintenanceMode) {
      res.status(503).json({
        success: false,
        message: 'Le site est actuellement en maintenance. Veuillez réessayer ultérieurement.',
        maintenanceMode: true
      });
      return;
    }

    next();
  } catch (error) {
    // En cas d'erreur, on laisse passer pour ne pas bloquer le site
    next();
  }
};