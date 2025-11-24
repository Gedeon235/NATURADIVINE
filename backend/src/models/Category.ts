// models/Category.ts
import { Schema, Document, model, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  parentCategory?: Types.ObjectId;
  isActive: boolean;
  order: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  featured: boolean;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { 
    type: String, 
    required: [true, 'Le nom de la catégorie est obligatoire'],
    unique: true,
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: { 
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  image: { 
    type: String 
  },
  parentCategory: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    default: null,
    index: true
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  },
  order: { 
    type: Number, 
    default: 0,
    min: [0, 'L\'ordre ne peut pas être négatif']
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    index: true
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Le meta title ne peut pas dépasser 60 caractères']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'La meta description ne peut pas dépasser 160 caractères']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour les sous-catégories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
  justOne: false
});

// Virtual pour le nombre de produits
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Middleware pour générer le slug avant sauvegarde
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9 -]/g, '') // Garde seulement les caractères alphanumériques, espaces et tirets
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/-+/g, '-') // Supprime les tirets multiples
      .trim();
  }
  next();
});

// Index composites pour améliorer les performances
categorySchema.index({ parentCategory: 1, order: 1 });
categorySchema.index({ isActive: 1, featured: 1 });
categorySchema.index({ slug: 1, isActive: 1 });

// Méthode statique pour obtenir les catégories avec leurs sous-catégories
categorySchema.statics.getHierarchy = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $graphLookup: {
        from: 'categories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parentCategory',
        as: 'subcategories',
        maxDepth: 2
      }
    },
    { $match: { parentCategory: null } }, // Seulement les catégories racines
    { $sort: { order: 1, name: 1 } },
    {
      $project: {
        name: 1,
        description: 1,
        image: 1,
        slug: 1,
        featured: 1,
        order: 1,
        subcategories: {
          $filter: {
            input: '$subcategories',
            as: 'sub',
            cond: { $ne: ['$$sub._id', '$_id'] } // Exclure la catégorie elle-même
          }
        }
      }
    }
  ]);
};

// Méthode pour compter les produits par catégorie
categorySchema.statics.getProductCounts = async function() {
  const Product = model('Product');
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        productCount: { $size: '$products' }
      }
    },
    { $sort: { productCount: -1 } }
  ]);
};

export default model<ICategory>('Category', categorySchema);