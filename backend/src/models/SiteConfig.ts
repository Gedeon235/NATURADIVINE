import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteConfig extends Document {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  siteName: string;
  description: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteConfigSchema: Schema = new Schema(
  {
    logo: {
      type: String,
      default: '/images/logo.png'
    },
    primaryColor: {
      type: String,
      default: '#3b82f6'
    },
    secondaryColor: {
      type: String,
      default: '#f59e0b'
    },
    siteName: {
      type: String,
      required: [true, 'Le nom du site est requis'],
      default: 'Beauty Salon'
    },
    description: {
      type: String,
      default: 'Votre salon de beauté premium'
    },
    contactEmail: {
      type: String,
      required: [true, 'L\'email de contact est requis']
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis']
    },
    address: {
      type: String,
      required: [true, 'L\'adresse est requise']
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      tiktok: String
    },
    businessHours: {
      monday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        closed: { type: Boolean, default: false }
      },
      tuesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        closed: { type: Boolean, default: false }
      },
      wednesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        closed: { type: Boolean, default: false }
      },
      thursday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        closed: { type: Boolean, default: false }
      },
      friday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '18:00' },
        closed: { type: Boolean, default: false }
      },
      saturday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '16:00' },
        closed: { type: Boolean, default: false }
      },
      sunday: {
        open: { type: String, default: '00:00' },
        close: { type: String, default: '00:00' },
        closed: { type: Boolean, default: true }
      }
    },
    metaTitle: {
      type: String,
      default: 'Beauty Salon - Votre salon de beauté'
    },
    metaDescription: {
      type: String,
      default: 'Découvrez nos services de beauté et prenez rendez-vous en ligne'
    },
    keywords: [{
      type: String
    }],
    maintenanceMode: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// S'assurer qu'il n'y a qu'un seul document de configuration
SiteConfigSchema.post('save', async function() {
  const model = mongoose.model('SiteConfig');
  const docs = await model.find({ _id: { $ne: this._id } });
  if (docs.length > 0) {
    await model.deleteMany({ _id: { $ne: this._id } });
  }
});

export default mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);