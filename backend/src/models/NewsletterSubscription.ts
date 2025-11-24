import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INewsletterSubscription extends Document {
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  preferences: string[];
  token: string; // Pour les liens de désinscription
  source?: string; // Source d'inscription (site, formulaire, etc.)
  lastSentAt?: Date; // Date du dernier envoi
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
  {
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date
    },
    preferences: [{
      type: String,
      enum: ['promotions', 'nouvelles_collections', 'conseils_beaute', 'offres_speciales', 'actualites'],
      default: ['promotions', 'nouvelles_collections']
    }],
    token: {
      type: String,
      required: true,
      unique: true
    },
    source: {
      type: String,
      default: 'site_web'
    },
    lastSentAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index pour les requêtes courantes
newsletterSubscriptionSchema.index({ email: 1 });
newsletterSubscriptionSchema.index({ isActive: 1 });
newsletterSubscriptionSchema.index({ token: 1 });
newsletterSubscriptionSchema.index({ subscribedAt: -1 });

// Méthode pour générer un token unique
newsletterSubscriptionSchema.pre('save', function(next) {
  if (this.isNew) {
    this.token = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});

// Méthode pour désactiver l'abonnement
newsletterSubscriptionSchema.methods.unsubscribe = function() {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

// Méthode pour réactiver l'abonnement
newsletterSubscriptionSchema.methods.resubscribe = function() {
  this.isActive = true;
  this.unsubscribedAt = undefined;
  return this.save();
};

export default mongoose.model<INewsletterSubscription>('NewsletterSubscription', newsletterSubscriptionSchema);