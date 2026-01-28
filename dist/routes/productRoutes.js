"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middlewares/auth");
const validateRequest_1 = require("../middlewares/validateRequest");
const productValidators_1 = require("../validators/productValidators");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post('/', (0, validateRequest_1.validateRequest)(productValidators_1.productSchema), productController_1.createProduct);
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
router.put('/:id', (0, validateRequest_1.validateRequest)(productValidators_1.productSchema.partial()), productController_1.updateProduct);
router.delete('/:id', productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map