import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  client: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  beautician: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  duration: number; // en minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  price: number;
  notes?: string;
  clientNotes?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le client est obligatoire']
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Le service est obligatoire']
    },
    beautician: {
      type: Schema.Types.ObjectId,
      ref: 'Beautician',
      required: [true, 'L\'esthéticienne est obligatoire']
    },
    date: {
      type: Date,
      required: [true, 'La date est obligatoire'],
      validate: {
        validator: function(value: Date) {
          return value > new Date();
        },
        message: 'La date du rendez-vous doit être dans le futur'
      }
    },
    timeSlot: {
      type: String,
      required: [true, 'Le créneau horaire est obligatoire'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format de temps invalide (HH:MM)']
    },
    duration: {
      type: Number,
      required: [true, 'La durée est obligatoire'],
      min: [15, 'La durée minimum est de 15 minutes'],
      max: [180, 'La durée maximum est de 180 minutes'],
      default: 60
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending'
    },
    price: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    notes: {
      type: String,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
    },
    clientNotes: {
      type: String,
      maxlength: [500, 'Les notes client ne peuvent pas dépasser 500 caractères']
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Empêcher les doublons de rendez-vous pour la même esthéticienne au même moment
appointmentSchema.index({ beautician: 1, date: 1, timeSlot: 1 }, { unique: true });

// Index pour les requêtes courantes
appointmentSchema.index({ client: 1, date: 1 });
appointmentSchema.index({ beautician: 1, date: 1 });
appointmentSchema.index({ status: 1, date: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);