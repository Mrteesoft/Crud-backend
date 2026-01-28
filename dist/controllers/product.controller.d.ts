import { Response } from 'express';
import { ProductInput } from '../validators/product.validators';
import { AuthRequest } from '../middlewares/auth';
export declare const createProduct: (req: AuthRequest<{}, {}, ProductInput>, res: Response) => Promise<void>;
export declare const getProducts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProductById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProduct: (req: AuthRequest<{}, {}, Partial<ProductInput>>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProduct: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=product.controller.d.ts.map