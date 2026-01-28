import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { AuthRequest } from '../middlewares/auth';

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};


