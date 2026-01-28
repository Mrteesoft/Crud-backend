import mongoose, { Document, Schema } from 'mongoose';

export type InstallmentStatus = 'pending' | 'paid';

export interface IInstallment extends Document {
  purchaseId: mongoose.Types.ObjectId;
  sequence: number;
  dueDate: Date;
  amount: number;
  status: InstallmentStatus;
}

const installmentSchema = new Schema<IInstallment>(
  {
    purchaseId: { type: Schema.Types.ObjectId, ref: 'Purchase', required: true },
    sequence: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  },
  { timestamps: true }
);

installmentSchema.index({ purchaseId: 1, sequence: 1 }, { unique: true });

export const Installment = mongoose.model<IInstallment>('Installment', installmentSchema);


