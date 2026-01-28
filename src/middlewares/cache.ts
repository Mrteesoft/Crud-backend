import NodeCache from 'node-cache';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

type KeyBuilder = (req: AuthRequest) => string;

export const cacheMiddleware = (buildKey: KeyBuilder, ttlSeconds = 60) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();

    const key = buildKey(req);
    const cached = cache.get(key);
    if (cached) {
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, body, ttlSeconds);
      return originalJson(body);
    };

    next();
  };
};

export const cacheClient = cache;


