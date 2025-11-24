import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId; // Ajout de _id optionnel
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  total: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Le produit est obligatoire']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est obligatoire'],
    min: [1, 'La quantité minimum est 1'],
    max: [99, 'La quantité maximum est 99'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  }
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est obligatoire'],
      unique: true
    },
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
      min: [0, 'Le total ne peut pas être négatif']
    },
    expiresAt: {
      type: Date,
      default: function() {
        const date = new Date();
        date.setDate(date.getDate() + 30); // Expire après 30 jours
        return date;
      }
    }
  },
  {
    timestamps: true
  }
);

// Calculer le total avant de sauvegarder
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  next();
});

export default mongoose.model<ICart>('Cart', cartSchema);