import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController';
import { authMiddleware } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { productSchema } from '../validators/productValidators';

const router = Router();

router.use(authMiddleware);

router.post('/', validateRequest(productSchema), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', validateRequest(productSchema.partial()), updateProduct);
router.delete('/:id', deleteProduct);

export default router;


