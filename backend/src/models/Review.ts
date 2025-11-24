import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  product?: Types.ObjectId;
  service?: Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est obligatoire']
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service'
    },
    rating: {
      type: Number,
      required: [true, 'La note est obligatoire'],
      min: [1, 'La note minimum est 1'],
      max: [5, 'La note maximum est 5']
    },
    comment: {
      type: String,
      required: [true, 'Le commentaire est obligatoire'],
      minlength: [10, 'Le commentaire doit contenir au moins 10 caractères'],
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères'],
      trim: true
    },
    images: [{
      type: String,
      validate: {
        validator: function(images: string[]) {
          return images.length <= 5;
        },
        message: 'Maximum 5 images par avis'
      }
    }],
    verified: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Validation : Un avis doit être lié à un produit OU un service, pas les deux
reviewSchema.pre('save', function(next) {
  if ((this.product && this.service) || (!this.product && !this.service)) {
    next(new Error('Un avis doit être lié à un produit OU un service, pas les deux'));
  } else {
    next();
  }
});

// Index pour les requêtes courantes
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ service: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1, status: 1 });

// Index composé pour empêcher les doublons (un utilisateur ne peut review qu'une fois par produit/service)
reviewSchema.index({ user: 1, product: 1 }, { 
  unique: true, 
  partialFilterExpression: { product: { $exists: true } } 
});
reviewSchema.index({ user: 1, service: 1 }, { 
  unique: true, 
  partialFilterExpression: { service: { $exists: true } } 
});

// Méthode statique pour calculer la moyenne des notes
reviewSchema.statics.calculateAverageRating = async function(productId?: Types.ObjectId, serviceId?: Types.ObjectId) {
  const matchStage: any = { status: 'approved' };
  
  if (productId) {
    matchStage.product = productId;
  } else if (serviceId) {
    matchStage.service = serviceId;
  }

  const result = await this.aggregate([
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

export default mongoose.model<IReview>('Review', reviewSchema);