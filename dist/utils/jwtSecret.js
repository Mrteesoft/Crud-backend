"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = void 0;
const SECRET = process.env.JWT_SECRET || "dummy-secret";
const getJwtSecret = () => SECRET;
exports.getJwtSecret = getJwtSecret;
//# sourceMappingURL=jwtSecret.js.map