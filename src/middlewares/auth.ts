import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getLogger } from '../utils/logger';
import { getJwtSecret } from '../utils/jwtSecret';
import { UserRole } from '../models/userModel';

const log = getLogger('Auth');

export interface AuthUser {
  id: string;
  role: UserRole;
}

export interface AuthRequest<Params = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: AuthUser;
}

const coreAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization || (req.headers as any).Authorization) as string | undefined;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  const token = bearerToken || (req.query.token as string | undefined);

  if (!token) {
    log.warn('Auth missing token', { path: req.path });
    return res.status(401).json({ message: 'Authentication required' });
  }

  const secret = getJwtSecret();

  try {
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded?.userId) {
      log.warn('Auth invalid payload', { path: req.path });
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    req.user = { id: decoded.userId, role: decoded.role || 'user' };
    next();
  } catch (error) {
    log.warn('JWT verification failed', { error, path: req.path });
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const protect = coreAuth;
export const protectMerchants = (req: AuthRequest, res: Response, next: NextFunction) => {
  coreAuth(req, res, (err?: any) => {
    if (err) return; // coreAuth already responded
    if (req.user?.role === 'merchant' || req.user?.role === 'admin') return next();
    return res.status(403).json({ message: 'Merchant role required' });
  });
};

export const authMiddleware = coreAuth; // backward compatibility