import { Request, Response } from 'express';
import { User, UserRole } from '../models/userModel';
import { generateToken } from '../utils/token';
import { RegisterInput, LoginInput } from '../validators/authValidators';
import { getLogger } from '../utils/logger';

const log = getLogger('AuthController');

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already registered' });
    }

    const user = await User.create({ name, email, password, role: role as UserRole });
    log.info('Registered new user', { email, role: user.role });
    const token = generateToken(user.id, user.role);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err: any) {
    log.error('Register failed', { error: err.message });
    res.status(500).json({ message: 'Unable to register' });
  }
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user.id, user.role as UserRole);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err: any) {
    log.error('Login failed', { error: err.message });
    res.status(500).json({ message: 'Unable to login' });
  }
};