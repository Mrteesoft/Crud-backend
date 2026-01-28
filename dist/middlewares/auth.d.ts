import { Request, Response, NextFunction } from 'express';
export interface AuthRequest<Params = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<Params, ResBody, ReqBody, ReqQuery> {
    user?: {
        id: string;
    };
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map