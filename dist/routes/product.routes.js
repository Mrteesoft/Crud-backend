"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middlewares/auth");
const validateRequest_1 = require("../middlewares/validateRequest");
const product_validators_1 = require("../validators/product.validators");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post('/', (0, validateRequest_1.validateRequest)(product_validators_1.productSchema), product_controller_1.createProduct);
router.get('/', product_controller_1.getProducts);
router.get('/:id', product_controller_1.getProductById);
router.put('/:id', (0, validateRequest_1.validateRequest)(product_validators_1.productSchema.partial()), product_controller_1.updateProduct);
router.delete('/:id', product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map