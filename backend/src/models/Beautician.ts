import mongoose, { Document, Schema } from 'mongoose';

export interface IBeautician extends Document {
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  workingHours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  experience: number; // in years
  rating: {
    average: number;
    count: number;
  };
  avatar: string;
  bio: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const beauticianSchema = new Schema<IBeautician>(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone est obligatoire']
    },
    specialties: [{
      type: String,
      enum: ['Coiffure', 'Maquillage', 'Massage', 'Soin visage', 'Soin de peau', 'Manicure', 'Pédicure', 'Conseils beauté', 'Gommage corps']
    }],
    workingHours: {
      monday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true }
      },
      tuesday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true }
      },
      wednesday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true }
      },
      thursday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true }
      },
      friday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true }
      },
      saturday: {
        start: { type: String, default: '10:00' },
        end: { type: String, default: '16:00' },
        available: { type: Boolean, default: true }
      },
      sunday: {
        start: { type: String, default: '00:00' },
        end: { type: String, default: '00:00' },
        available: { type: Boolean, default: false }
      }
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
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
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IBeautician>('Beautician', beauticianSchema);