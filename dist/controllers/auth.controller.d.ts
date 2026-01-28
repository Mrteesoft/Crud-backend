import { Request, Response } from 'express';
import { RegisterInput, LoginInput } from '../validators/auth.validators';
export declare const register: (req: Request<{}, {}, RegisterInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request<{}, {}, LoginInput>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map