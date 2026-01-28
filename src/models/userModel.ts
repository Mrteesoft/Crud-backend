import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'user' | 'merchant' | 'admin';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'merchant', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  const user = this as IUser;
  if (!user.isModified('password')) return;
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

userSchema.methods.comparePassword = function (candidate: string) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);