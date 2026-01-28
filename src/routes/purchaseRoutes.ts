import { Router } from 'express';
import {
  createPurchase,
  deletePurchase,
  getPurchaseById,
  getPurchases,
  updatePurchase,
  getInstallments,
  payNextInstallment,
} from '../controllers/purchaseController';
import { protect } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import { purchaseSchema } from '../validators/purchaseValidators';

const router = Router();
router.use(protect);

/**
 * @openapi
 * /purchases:
 *   post:
 *     tags: [Purchases]
 *     summary: Create BNPL purchase
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseInput'
 *           example:
 *             merchantId: "6123456789abcdef01234567"
 *             itemName: iPhone 16
 *             amount: 1200
 *             tenureMonths: 6
 *             interestRate: 5
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', validateRequest(purchaseSchema), createPurchase);

/**
 * @openapi
 * /purchases:
 *   get:
 *     tags: [Purchases]
 *     summary: List purchases (optional status filter)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/PurchaseStatus'
 *     responses:
 *       200:
 *         description: List of purchases
 */
router.get('/', getPurchases);

/**
 * @openapi
 * /purchases/{id}:
 *   get:
 *     tags: [Purchases]
 *     summary: Get purchase by id
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
 *         description: Purchase
 *       404:
 *         description: Not found
 */
router.get('/:id', getPurchaseById);

/**
 * @openapi
 * /purchases/{id}:
 *   patch:
 *     tags: [Purchases]
 *     summary: Update purchase
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
 *             $ref: '#/components/schemas/PurchaseInput'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.patch('/:id', validateRequest(purchaseSchema.partial()), updatePurchase);

/**
 * @openapi
 * /purchases/{id}:
 *   delete:
 *     tags: [Purchases]
 *     summary: Delete purchase
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
router.delete('/:id', deletePurchase);

/**
 * @openapi
 * /purchases/{id}/installments:
 *   get:
 *     tags: [Purchases]
 *     summary: Get installments for a purchase
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
 *         description: List installments
 */
router.get('/:id/installments', getInstallments);

/**
 * @openapi
 * /purchases/{id}/pay:
 *   post:
 *     tags: [Purchases]
 *     summary: Pay next installment
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
 *         description: Paid next installment
 *       400:
 *         description: All installments already paid
 */
router.post('/:id/pay', payNextInstallment);

export default router;
