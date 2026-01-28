"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantSchema = void 0;
const zod_1 = require("zod");
exports.merchantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().optional(),
    contactEmail: zod_1.z.string().email().optional(),
});
//# sourceMappingURL=merchant.validators.js.map