import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  category: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image: string;
  active: boolean;
  beauticians: mongoose.Types.ObjectId[];
  requirements?: string;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Le nom du service est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      enum: ['Coiffure', 'Maquillage', 'Massage', 'Soin visage', 'Soin de peau', 'Manicure', 'Pédicure', 'Conseils beauté', 'Gommage corps']
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    duration: {
      type: Number,
      required: [true, 'La durée est obligatoire'],
      min: [15, 'La durée minimum est de 15 minutes'],
      max: [180, 'La durée maximum est de 180 minutes'],
      default: 60
    },
    price: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    image: {
      type: String,
      required: [true, 'L\'image est obligatoire']
    },
    active: {
      type: Boolean,
      default: true
    },
    beauticians: [{
      type: Schema.Types.ObjectId,
      ref: 'Beautician'
    }],
    requirements: {
      type: String,
      maxlength: [200, 'Les prérequis ne peuvent pas dépasser 200 caractères']
    },
    benefits: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IService>('Service', serviceSchema);