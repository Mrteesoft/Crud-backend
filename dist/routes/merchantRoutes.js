"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const merchantController_1 = require("../controllers/merchantController");
const validateRequest_1 = require("../middlewares/validateRequest");
const merchantValidators_1 = require("../validators/merchantValidators");
const cache_1 = require("../middlewares/cache");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public create/list/read
router.post('/', (0, validateRequest_1.validateRequest)(merchantValidators_1.merchantSchema), merchantController_1.createMerchant);
router.get('/', (0, cache_1.cacheMiddleware)(() => `merchants:public:list`), merchantController_1.getMerchants);
router.get('/:id', (0, cache_1.cacheMiddleware)((req) => `merchants:public:${req.params.id}`), merchantController_1.getMerchantById);
// Protected update/delete
router.patch('/:id', auth_1.protectMerchants, (0, validateRequest_1.validateRequest)(merchantValidators_1.merchantSchema.partial()), merchantController_1.updateMerchant);
router.delete('/:id', auth_1.protectMerchants, merchantController_1.deleteMerchant);
exports.default = router;
//# sourceMappingURL=merchantRoutes.js.map