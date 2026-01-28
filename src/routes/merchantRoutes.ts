import { Router } from 'express';
import {
  createMerchant,
  deleteMerchant,
  getMerchantById,
  getMerchants,
  updateMerchant,
} from '../controllers/merchantController';
import { validateRequest } from '../middlewares/validateRequest';
import { merchantSchema } from '../validators/merchantValidators';
import { cacheMiddleware } from '../middlewares/cache';
import { protectMerchants } from '../middlewares/auth';

const router = Router();
router.use(protectMerchants);

/**
 * @openapi
 * /merchants:
 *   post:
 *     tags: [Merchants]
 *     summary: Create merchant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MerchantInput'
 *           example:
 *             name: Gadget Store
 *             category: Electronics
 *             contactEmail: support@gadget.com
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', validateRequest(merchantSchema), createMerchant);

/**
 * @openapi
 * /merchants:
 *   get:
 *     tags: [Merchants]
 *     summary: List merchants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of merchants
 */
router.get('/', cacheMiddleware((req) => `merchants:${req.user?.id}:list`), getMerchants);

/**
 * @openapi
 * /merchants/{id}:
 *   get:
 *     tags: [Merchants]
 *     summary: Get merchant by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merchant
 *       404:
 *         description: Not found
 */
router.get('/:id', cacheMiddleware((req) => `merchants:${req.user?.id}:${req.params.id}`), getMerchantById);

/**
 * @openapi
 * /merchants/{id}:
 *   patch:
 *     tags: [Merchants]
 *     summary: Update merchant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MerchantInput'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.patch('/:id', validateRequest(merchantSchema.partial()), updateMerchant);

/**
 * @openapi
 * /merchants/{id}:
 *   delete:
 *     tags: [Merchants]
 *     summary: Delete merchant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', deleteMerchant);

export default router;