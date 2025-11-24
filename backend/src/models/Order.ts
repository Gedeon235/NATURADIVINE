import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
  notes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'cash' | 'mobile_money' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Le produit est obligatoire']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est obligatoire'],
    min: [1, 'La quantité minimum est 1']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  name: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire']
  },
  image: {
    type: String,
    required: [true, 'L\'image du produit est obligatoire']
  }
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  fullName: {
    type: String,
    required: [true, 'Le nom complet est obligatoire'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est obligatoire'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'La ville est obligatoire'],
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Le téléphone est obligatoire'],
    match: [/^[0-9+\-\s()]{10,}$/, 'Numéro de téléphone invalide']
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  }
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est obligatoire']
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['cash', 'mobile_money', 'card'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    itemsPrice: {
      type: Number,
      required: [true, 'Le prix des articles est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    shippingPrice: {
      type: Number,
      required: [true, 'Le prix de livraison est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif'],
      default: 0
    },
    taxPrice: {
      type: Number,
      required: [true, 'Le prix des taxes est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif'],
      default: 0
    },
    totalPrice: {
      type: Number,
      required: [true, 'Le prix total est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
    }
  },
  {
    timestamps: true
  }
);

// Générer un numéro de commande avant de sauvegarder
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Compter les commandes du jour pour le numéro séquentiel
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const dailyOrderCount = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    const sequentialNumber = String(dailyOrderCount + 1).padStart(4, '0');
    this.orderNumber = `CMD-${year}${month}${day}-${sequentialNumber}`;
  }
  next();
});

// Index pour les recherches courantes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

export default mongoose.model<IOrder>('Order', orderSchema);