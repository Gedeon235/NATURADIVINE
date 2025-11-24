import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INewsletterCampaign extends Document {
  title: string;
  subject: string;
  content: string;
  recipients: {
    all: boolean;
    segments?: string[];
    count: number;
  };
  sent: boolean;
  sentAt?: Date;
  scheduledFor?: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const newsletterCampaignSchema = new Schema<INewsletterCampaign>(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    subject: {
      type: String,
      required: [true, 'Le sujet est obligatoire'],
      trim: true,
      maxlength: [150, 'Le sujet ne peut pas dépasser 150 caractères']
    },
    content: {
      type: String,
      required: [true, 'Le contenu est obligatoire']
    },
    recipients: {
      all: {
        type: Boolean,
        default: false
      },
      segments: [{
        type: String,
        enum: ['new_subscribers', 'inactive', 'frequent_buyers']
      }],
      count: {
        type: Number,
        default: 0
      }
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    },
    scheduledFor: {
      type: Date
    },
    stats: {
      sent: {
        type: Number,
        default: 0
      },
      delivered: {
        type: Number,
        default: 0
      },
      opened: {
        type: Number,
        default: 0
      },
      clicked: {
        type: Number,
        default: 0
      },
      bounced: {
        type: Number,
        default: 0
      },
      unsubscribed: {
        type: Number,
        default: 0
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<INewsletterCampaign>('NewsletterCampaign', newsletterCampaignSchema);