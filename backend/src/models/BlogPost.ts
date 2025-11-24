import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Types.ObjectId;
  image: string;
  images?: string[];
  tags: string[];
  category: string;
  publishedAt?: Date;
  isPublished: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  readingTime: number;
  views: number;
  likes: number;
  comments: {
    user: Types.ObjectId;
    content: string;
    isApproved: boolean;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      maxlength: [120, 'Le titre ne peut pas dépasser 120 caractères']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: [true, 'L\'extrait est obligatoire'],
      maxlength: [200, 'L\'extrait ne peut pas dépasser 200 caractères']
    },
    content: {
      type: String,
      required: [true, 'Le contenu est obligatoire'],
      minlength: [100, 'Le contenu doit contenir au moins 100 caractères']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'auteur est obligatoire']
    },
    image: {
      type: String,
      required: [true, 'L\'image principale est obligatoire']
    },
    images: [{
      type: String
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      enum: [
        'soins-visage',
        'soins-corps', 
        'soins-cheveux',
        'maquillage',
        'conseils-beaute',
        'tendances',
        'recettes-naturelles',
        'bien-etre'
      ]
    },
    publishedAt: {
      type: Date
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    metaTitle: {
      type: String,
      maxlength: [60, 'Le meta titre ne peut pas dépasser 60 caractères']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'La meta description ne peut pas dépasser 160 caractères']
    },
    readingTime: {
      type: Number,
      default: 0,
      min: 0
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
      },
      isApproved: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true
  }
);

// Index pour les requêtes courantes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ isPublished: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, isPublished: 1 });
blogPostSchema.index({ tags: 1, isPublished: 1 });
blogPostSchema.index({ author: 1, isPublished: 1 });
blogPostSchema.index({ isFeatured: 1, publishedAt: -1 });

// Middleware pour générer le slug avant la sauvegarde
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9 -]/g, '') // Supprime les caractères non alphanumériques
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/-+/g, '-') // Supprime les tirets multiples
      .trim();
  }

  // Calcul du temps de lecture (environ 200 mots par minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Si l'article est publié et n'a pas encore de date de publication
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Méthode pour incrémenter les vues
blogPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Méthode pour ajouter un like
blogPostSchema.methods.addLike = function() {
  this.likes += 1;
  return this.save();
};

// Méthode pour retirer un like
blogPostSchema.methods.removeLike = function() {
  if (this.likes > 0) {
    this.likes -= 1;
  }
  return this.save();
};

// Méthode pour ajouter un commentaire
blogPostSchema.methods.addComment = function(userId: Types.ObjectId, content: string) {
  this.comments.push({
    user: userId,
    content,
    isApproved: false
  });
  return this.save();
};

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);