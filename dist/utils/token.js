"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret_1 = require("./jwtSecret");
const generateToken = (userId, role = 'user') => {
    const secret = (0, jwtSecret_1.getJwtSecret)();
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return jsonwebtoken_1.default.sign({ userId, role }, secret, { expiresIn });
};
exports.generateToken = generateToken;
//# sourceMappingURL=token.js.map