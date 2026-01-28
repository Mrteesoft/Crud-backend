import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  owner: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);


