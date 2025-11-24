import { Request, Response } from 'express';
import SiteConfig from '../models/SiteConfig.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get site configuration
// @route   GET /api/config
// @access  Public
export const getConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    let config = await SiteConfig.findOne();

    // Si aucune configuration n'existe, créer une configuration par défaut
    if (!config) {
      config = await SiteConfig.create({
        siteName: 'Beauty Salon',
        contactEmail: 'contact@beautysalon.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Avenue des Champs-Élysées, 75008 Paris',
        description: 'Votre salon de beauté premium'
      });
    }

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update site configuration
// @route   PUT /api/config
// @access  Private/Admin
export const updateConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      logo,
      primaryColor,
      secondaryColor,
      siteName,
      description,
      contactEmail,
      phone,
      address,
      socialMedia,
      businessHours,
      metaTitle,
      metaDescription,
      keywords,
      maintenanceMode
    } = req.body;

    let config = await SiteConfig.findOne();

    if (!config) {
      // Créer la configuration si elle n'existe pas
      config = await SiteConfig.create({
        logo,
        primaryColor,
        secondaryColor,
        siteName,
        description,
        contactEmail,
        phone,
        address,
        socialMedia,
        businessHours,
        metaTitle,
        metaDescription,
        keywords,
        maintenanceMode
      });
    } else {
      // Mettre à jour la configuration existante
      config.logo = logo || config.logo;
      config.primaryColor = primaryColor || config.primaryColor;
      config.secondaryColor = secondaryColor || config.secondaryColor;
      config.siteName = siteName || config.siteName;
      config.description = description || config.description;
      config.contactEmail = contactEmail || config.contactEmail;
      config.phone = phone || config.phone;
      config.address = address || config.address;
      config.metaTitle = metaTitle || config.metaTitle;
      config.metaDescription = metaDescription || config.metaDescription;
      config.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : config.maintenanceMode;

      // Mettre à jour les médias sociaux si fournis
      if (socialMedia) {
        config.socialMedia = {
          ...config.socialMedia,
          ...socialMedia
        };
      }

      // Mettre à jour les horaires d'ouverture si fournis
      if (businessHours) {
        config.businessHours = {
          ...config.businessHours,
          ...businessHours
        };
      }

      // Mettre à jour les mots-clés si fournis
      if (keywords) {
        config.keywords = keywords;
      }

      await config.save();
    }

    res.status(200).json({
      success: true,
      message: 'Configuration mise à jour avec succès',
      data: config
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get maintenance mode status
// @route   GET /api/config/maintenance
// @access  Public
export const getMaintenanceMode = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = await SiteConfig.findOne();
    
    res.status(200).json({
      success: true,
      data: {
        maintenanceMode: config?.maintenanceMode || false
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};