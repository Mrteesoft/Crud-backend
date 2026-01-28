"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseSchema = void 0;
const zod_1 = require("zod");
const statusEnum = zod_1.z.enum(['pending', 'approved', 'active', 'completed', 'defaulted']);
exports.purchaseSchema = zod_1.z.object({
    merchantId: zod_1.z.string().min(1),
    itemName: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
    tenureMonths: zod_1.z.number().int().positive(),
    interestRate: zod_1.z.number().nonnegative().optional(),
    status: statusEnum.optional(),
    startDate: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=purchase.validators.js.map