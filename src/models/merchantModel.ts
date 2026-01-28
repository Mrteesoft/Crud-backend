import mongoose, { Document, Schema } from 'mongoose';

export interface IMerchant extends Document {
  name: string;
  category?: string;
  contactEmail?: string;
  owner: mongoose.Types.ObjectId;
}

const merchantSchema = new Schema<IMerchant>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Merchant = mongoose.model<IMerchant>('Merchant', merchantSchema);
