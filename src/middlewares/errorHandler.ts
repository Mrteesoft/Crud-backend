import { NextFunction, Request, Response } from 'express';
import { getLogger } from '../utils/logger';

const log = getLogger('Error');

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  log.error(err.message || 'Unhandled error', { stack: err.stack });
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
}
