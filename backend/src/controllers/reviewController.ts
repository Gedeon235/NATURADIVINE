import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import { AuthRequest } from '../middleware/auth.js';

// Fonction utilitaire pour calculer la moyenne (solution alternative)
const calculateAverageRating = async (productId?: Types.ObjectId, serviceId?: Types.ObjectId) => {
  const matchStage: any = { status: 'approved' };
  
  if (productId) {
    matchStage.product = productId;
  } else if (serviceId) {
    matchStage.service = serviceId;
  }

  const result = await Review.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (result.length > 0) {
    const distribution = result[0].ratingDistribution;
    const ratingCounts = {
      1: distribution.filter((r: number) => r === 1).length,
      2: distribution.filter((r: number) => r === 2).length,
      3: distribution.filter((r: number) => r === 3).length,
      4: distribution.filter((r: number) => r === 4).length,
      5: distribution.filter((r: number) => r === 5).length
    };

    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      reviewCount: result[0].reviewCount,
      ratingCounts
    };
  }

  return {
    averageRating: 0,
    reviewCount: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, serviceId, rating, comment, images } = req.body;

    // Validation de base
    if (!rating || !comment) {
      res.status(400).json({
        success: false,
        message: 'La note et le commentaire sont obligatoires'
      });
      return;
    }

    if (!productId && !serviceId) {
      res.status(400).json({
        success: false,
        message: 'Un avis doit être lié à un produit ou un service'
      });
      return;
    }

    // Vérifier si le produit/service existe
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }
    }

    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        res.status(404).json({
          success: false,
          message: 'Service non trouvé'
        });
        return;
      }
    }

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit/service
    const existingReview = await Review.findOne({
      user: req.user?._id,
      $or: [
        { product: productId },
        { service: serviceId }
      ]
    });

    if (existingReview) {
      res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour ce produit/service'
      });
      return;
    }

    // Créer l'avis
    const review = await Review.create({
      user: req.user?._id,
      product: productId,
      service: serviceId,
      rating,
      comment,
      images: images || [],
      verified: false,
      status: 'pending'
    });

    await review.populate('user', 'name avatar');

    // Recalculer la moyenne des notes
    if (productId) {
      const stats = await calculateAverageRating(productId);
      await Product.findByIdAndUpdate(productId, {
        'ratings.average': stats.averageRating,
        'ratings.count': stats.reviewCount
      });
    } else if (serviceId) {
      const stats = await calculateAverageRating(undefined, serviceId);
      // Note: Vous devrez ajouter le champ ratings au modèle Service si nécessaire
    }

    res.status(201).json({
      success: true,
      message: 'Avis créé avec succès et en attente de modération',
      data: review
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour ce produit/service'
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews by product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getReviewsByProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest', rating } = req.query;

    let query: any = { 
      product: productId, 
      status: 'approved' 
    };

    // Filtre par note
    if (rating) {
      query.rating = parseInt(rating as string);
    }

    // Tri
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1 };
        break;
      case 'helpful':
        sortOption = { helpful: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sortOption)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Review.countDocuments(query);

    // Obtenir les statistiques des notes
    const stats = await calculateAverageRating(new Types.ObjectId(productId));

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        },
        stats
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews by service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
export const getReviewsByService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10, sort = 'newest', rating } = req.query;

    let query: any = { 
      service: serviceId, 
      status: 'approved' 
    };

    if (rating) {
      query.rating = parseInt(rating as string);
    }

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1 };
        break;
      case 'helpful':
        sortOption = { helpful: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sortOption)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Review.countDocuments(query);

    const stats = await calculateAverageRating(undefined, new Types.ObjectId(serviceId));

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        },
        stats
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
      return;
    }

    // Vérifier les permissions
    if (req.user?.role !== 'admin' && review.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet avis'
      });
      return;
    }

    // Mettre à jour
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (images) review.images = images;
    
    // Remettre en attente de modération si modifié par l'utilisateur
    if (req.user?.role !== 'admin') {
      review.status = 'pending';
    }

    await review.save();
    await review.populate('user', 'name avatar');

    // Recalculer la moyenne si la note a changé
    if (rating && (review.product || review.service)) {
      const productId = review.product as Types.ObjectId;
      const serviceId = review.service as Types.ObjectId;
      const stats = await calculateAverageRating(productId, serviceId);
      
      if (review.product) {
        await Product.findByIdAndUpdate(review.product, {
          'ratings.average': stats.averageRating,
          'ratings.count': stats.reviewCount
        });
      }
    }

    res.status(200).json({
      success: true,
      message: req.user?.role === 'admin' ? 'Avis mis à jour' : 'Avis mis à jour et en attente de modération',
      data: review
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
      return;
    }

    // Vérifier les permissions
    if (req.user?.role !== 'admin' && review.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet avis'
      });
      return;
    }

    const productId = review.product as Types.ObjectId;
    const serviceId = review.service as Types.ObjectId;

    await Review.findByIdAndDelete(req.params.id);

    // Recalculer la moyenne
    if (productId) {
      const stats = await calculateAverageRating(productId);
      await Product.findByIdAndUpdate(productId, {
        'ratings.average': stats.averageRating,
        'ratings.count': stats.reviewCount
      });
    } else if (serviceId) {
      // Gérer la mise à jour du service si nécessaire
    }

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès',
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
      return;
    }

    review.helpful += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Avis marqué comme utile',
      data: { helpful: review.helpful }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user?._id })
      .populate('product', 'name images')
      .populate('service', 'name image')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Review.countDocuments({ user: req.user?._id });

    res.status(200).json({
      success: true,
      data: {
        reviews,
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

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;

    let query: any = {};
    if (status) query.status = status;
    if (type === 'product') query.product = { $exists: true };
    if (type === 'service') query.service = { $exists: true };

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        reviews,
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

// @desc    Update review status (Admin)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('user', 'name')
    .populate('product', 'name')
    .populate('service', 'name');

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
      return;
    }

    // Si approuvé, recalculer les moyennes
    if (status === 'approved' && (review.product || review.service)) {
      const productId = review.product as Types.ObjectId;
      const serviceId = review.service as Types.ObjectId;
      const stats = await calculateAverageRating(productId, serviceId);
      
      if (review.product) {
        await Product.findByIdAndUpdate(review.product, {
          'ratings.average': stats.averageRating,
          'ratings.count': stats.reviewCount
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Statut de l'avis mis à jour: ${status}`,
      data: review
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};