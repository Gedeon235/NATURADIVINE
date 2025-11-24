import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  sku: string;
  featured: boolean;
  active: boolean;
  ratings: {
    average: number;
    count: number;
  };
  vendor: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      enum: ['Soins capillaires', 'Soins du corps', 'Huiles essentielles', 'Soins du visage', 'Maquillage', 'Accessoires']
    },
    price: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Le prix original ne peut pas être négatif']
    },
    images: [{
      type: String,
      required: [true, 'Au moins une image est requise']
    }],
    stock: {
      type: Number,
      required: [true, 'Le stock est obligatoire'],
      min: [0, 'Le stock ne peut pas être négatif'],
      default: 0
    },
    sku: {
      type: String,
      required: [true, 'Le SKU est obligatoire'],
      unique: true,
      uppercase: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    vendor: {
      type: String,
      default: 'Natura Divine Beauté'
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);