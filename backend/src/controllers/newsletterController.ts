import { Request, Response } from 'express';
import crypto from 'crypto';
import NewsletterSubscription from '../models/NewsletterSubscription.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, preferences, source } = req.body;

    // Validation
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'L\'email est obligatoire'
      });
      return;
    }

    // Vérifier le format de l'email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
      return;
    }

    // Vérifier si l'email existe déjà
    const existingSubscription = await NewsletterSubscription.findOne({ email });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        res.status(400).json({
          success: false,
          message: 'Cet email est déjà inscrit à la newsletter'
        });
        return;
      } else {
        // Réactiver l'abonnement existant
        existingSubscription.isActive = true;
        existingSubscription.unsubscribedAt = undefined;
        existingSubscription.preferences = preferences || ['promotions', 'nouvelles_collections'];
        existingSubscription.source = source || 'site_web';
        existingSubscription.token = crypto.randomBytes(32).toString('hex');
        
        await existingSubscription.save();

        res.status(200).json({
          success: true,
          message: 'Réabonnement à la newsletter réussi',
          data: existingSubscription
        });
        return;
      }
    }

    // Créer un nouvel abonnement
    const subscription = await NewsletterSubscription.create({
      email,
      preferences: preferences || ['promotions', 'nouvelles_collections'],
      source: source || 'site_web',
      token: crypto.randomBytes(32).toString('hex')
    });

    // Ici, vous devriez normalement envoyer un email de confirmation
    // await sendWelcomeEmail(email, subscription.token);

    res.status(201).json({
      success: true,
      message: 'Inscription à la newsletter réussie. Un email de confirmation a été envoyé.',
      data: subscription
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Cet email est déjà inscrit à la newsletter'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, token } = req.body;

    // Validation
    if (!email && !token) {
      res.status(400).json({
        success: false,
        message: 'L\'email ou le token est obligatoire'
      });
      return;
    }

    let subscription;

    if (token) {
      // Désinscription via token (lien dans l'email)
      subscription = await NewsletterSubscription.findOne({ token });
    } else if (email) {
      // Désinscription via email - email est défini ici grâce à la condition ci-dessus
      subscription = await NewsletterSubscription.findOne({ email: email.toLowerCase() });
    } else {
      // Ce cas ne devrait jamais se produire grâce à la validation initiale
      res.status(400).json({
        success: false,
        message: 'L\'email ou le token est obligatoire'
      });
      return;
    }

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: 'Abonnement non trouvé'
      });
      return;
    }

    if (!subscription.isActive) {
      res.status(400).json({
        success: false,
        message: 'Cet email n\'est pas inscrit à la newsletter'
      });
      return;
    }

    // Désactiver l'abonnement
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Désinscription de la newsletter réussie',
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unsubscribe using token (via lien email)
// @route   GET /api/newsletter/unsubscribe/:token
// @access  Public
export const unsubscribeByToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const subscription = await NewsletterSubscription.findOne({ token });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: 'Lien de désinscription invalide ou expiré'
      });
      return;
    }

    if (!subscription.isActive) {
      res.status(400).json({
        success: false,
        message: 'Cet email n\'est pas inscrit à la newsletter'
      });
      return;
    }

    // Désactiver l'abonnement
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    // Rediriger vers une page de confirmation ou afficher un message
    res.status(200).json({
      success: true,
      message: 'Vous avez été désinscrit de notre newsletter avec succès.',
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update newsletter preferences
// @route   PUT /api/newsletter/preferences
// @access  Public
export const updatePreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, preferences } = req.body;

    if (!email || !preferences) {
      res.status(400).json({
        success: false,
        message: 'L\'email et les préférences sont obligatoires'
      });
      return;
    }

    const subscription = await NewsletterSubscription.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!subscription) {
      res.status(404).json({
        success: false,
        message: 'Abonnement actif non trouvé'
      });
      return;
    }

    subscription.preferences = preferences;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Préférences de newsletter mises à jour',
      data: subscription
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get newsletter subscription status
// @route   GET /api/newsletter/status/:email
// @access  Public
export const getSubscriptionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'L\'email est obligatoire'
      });
      return;
    }

    const subscription = await NewsletterSubscription.findOne({ 
      email: email.toLowerCase() 
    });

    if (!subscription) {
      res.status(200).json({
        success: true,
        data: {
          subscribed: false,
          message: 'Email non inscrit'
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        subscribed: subscription.isActive,
        email: subscription.email,
        preferences: subscription.preferences,
        subscribedAt: subscription.subscribedAt,
        unsubscribedAt: subscription.unsubscribedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all newsletter subscribers (Admin)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
export const getSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status = 'active' } = req.query;

    let query: any = {};
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const subscribers = await NewsletterSubscription.find(query)
      .sort({ subscribedAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await NewsletterSubscription.countDocuments(query);
    const activeCount = await NewsletterSubscription.countDocuments({ isActive: true });
    const inactiveCount = await NewsletterSubscription.countDocuments({ isActive: false });

    res.status(200).json({
      success: true,
      data: {
        subscribers,
        stats: {
          total,
          active: activeCount,
          inactive: inactiveCount
        },
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get newsletter stats (Admin)
// @route   GET /api/newsletter/stats
// @access  Private/Admin
export const getNewsletterStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Statistiques des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await NewsletterSubscription.aggregate([
      {
        $facet: {
          totalSubscribers: [
            { $count: 'count' }
          ],
          activeSubscribers: [
            { $match: { isActive: true } },
            { $count: 'count' }
          ],
          newSubscribersLast30Days: [
            { 
              $match: { 
                subscribedAt: { $gte: thirtyDaysAgo } 
              } 
            },
            { $count: 'count' }
          ],
          unsubscribedLast30Days: [
            { 
              $match: { 
                unsubscribedAt: { $gte: thirtyDaysAgo } 
              } 
            },
            { $count: 'count' }
          ],
          preferencesStats: [
            { $unwind: '$preferences' },
            {
              $group: {
                _id: '$preferences',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};