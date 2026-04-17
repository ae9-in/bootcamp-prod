import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  durationType: 'hours' | 'days' | 'weeks' | 'months';
  durationValue: number;
  totalPrice: number;
  purchasedAt: Date;
  userId: mongoose.Types.ObjectId;
  userName: string;
}

const PurchaseSchema = new Schema<IPurchase>({
  durationType: { type: String, enum: ['hours', 'days', 'weeks', 'months'], required: true },
  durationValue: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true }
});

export const Purchase = mongoose.model<IPurchase>('Purchase', PurchaseSchema);