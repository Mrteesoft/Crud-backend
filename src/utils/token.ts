import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { getJwtSecret } from './jwtSecret';
import { UserRole } from '../models/userModel';

export const generateToken = (userId: string, role: UserRole = 'user') => {
  const secret = getJwtSecret() as jwt.Secret;
  const expiresIn: StringValue | number = (process.env.JWT_EXPIRES_IN as StringValue) || '1d';
  return jwt.sign({ userId, role }, secret, { expiresIn });
};