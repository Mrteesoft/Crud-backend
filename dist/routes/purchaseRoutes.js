"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const auth_1 = require("../middlewares/auth");
const validateRequest_1 = require("../middlewares/validateRequest");
const purchaseValidators_1 = require("../validators/purchaseValidators");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
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
router.post('/', (0, validateRequest_1.validateRequest)(purchaseValidators_1.purchaseSchema), purchaseController_1.createPurchase);
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
router.get('/', purchaseController_1.getPurchases);
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
router.get('/:id', purchaseController_1.getPurchaseById);
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
router.patch('/:id', (0, validateRequest_1.validateRequest)(purchaseValidators_1.purchaseSchema.partial()), purchaseController_1.updatePurchase);
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
router.delete('/:id', purchaseController_1.deletePurchase);
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
router.get('/:id/installments', purchaseController_1.getInstallments);
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
router.post('/:id/pay', purchaseController_1.payNextInstallment);
exports.default = router;
//# sourceMappingURL=purchaseRoutes.js.map