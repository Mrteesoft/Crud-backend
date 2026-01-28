"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const merchantController_1 = require("../controllers/merchantController");
const validateRequest_1 = require("../middlewares/validateRequest");
const merchantValidators_1 = require("../validators/merchantValidators");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protectMerchants);
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
router.post('/', (0, validateRequest_1.validateRequest)(merchantValidators_1.merchantSchema), merchantController_1.createMerchant);
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
router.get('/', merchantController_1.getMerchants);
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
router.get('/:id', merchantController_1.getMerchantById);
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
router.patch('/:id', (0, validateRequest_1.validateRequest)(merchantValidators_1.merchantSchema.partial()), merchantController_1.updateMerchant);
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
router.delete('/:id', merchantController_1.deleteMerchant);
exports.default = router;
//# sourceMappingURL=merchantRoutes.js.map