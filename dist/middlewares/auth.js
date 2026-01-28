"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.protectMerchants = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const jwtSecret_1 = require("../utils/jwtSecret");
const log = (0, logger_1.getLogger)('Auth');
const coreAuth = (req, res, next) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization);
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
    const token = bearerToken || req.query.token;
    if (!token) {
        log.warn('Auth missing token', { path: req.path });
        return res.status(401).json({ message: 'Authentication required' });
    }
    const secret = (0, jwtSecret_1.getJwtSecret)();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded?.userId) {
            log.warn('Auth invalid payload', { path: req.path });
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        req.user = { id: decoded.userId, role: decoded.role || 'user' };
        next();
    }
    catch (error) {
        log.warn('JWT verification failed', { error, path: req.path });
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.protect = coreAuth;
const protectMerchants = (req, res, next) => {
    coreAuth(req, res, (err) => {
        if (err)
            return; // coreAuth already responded
        if (req.user?.role === 'merchant' || req.user?.role === 'admin')
            return next();
        return res.status(403).json({ message: 'Merchant role required' });
    });
};
exports.protectMerchants = protectMerchants;
exports.authMiddleware = coreAuth; // backward compatibility
//# sourceMappingURL=auth.js.map