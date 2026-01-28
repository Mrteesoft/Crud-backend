import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../utils/logger';

const log = getLogger('HTTP');

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const userId = (req as any).user?.id;
    log.info('%s %s %d %dms%s', req.method, req.originalUrl, res.statusCode, ms, userId ? ` user=${userId}` : '');
  });

  next();
}
