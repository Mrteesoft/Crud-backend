import mongoose, { Document, Schema } from 'mongoose';

export type PurchaseStatus = 'pending' | 'approved' | 'active' | 'completed' | 'defaulted';

export interface IPurchase extends Document {
  merchantId: mongoose.Types.ObjectId;
  itemName: string;
  amount: number;
  tenureMonths: number;
  interestRate?: number;
  status: PurchaseStatus;
  startDate: Date;
  createdBy: mongoose.Types.ObjectId;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
    itemName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    tenureMonths: { type: Number, required: true, min: 1 },
    interestRate: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'active', 'completed', 'defaulted'],
      default: 'pending',
    },
    startDate: { type: Date, default: () => new Date() },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);


