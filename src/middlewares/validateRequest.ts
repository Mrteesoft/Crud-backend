import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
    return res.status(400).json({ errors });
  }
  req.body = result.data;
  next();
};


