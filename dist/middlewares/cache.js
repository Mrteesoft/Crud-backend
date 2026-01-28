"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheClient = exports.cacheMiddleware = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 60, checkperiod: 120 });
const cacheMiddleware = (buildKey, ttlSeconds = 60) => {
    return (req, res, next) => {
        if (req.method !== 'GET')
            return next();
        const key = buildKey(req);
        const cached = cache.get(key);
        if (cached) {
            return res.json(cached);
        }
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            cache.set(key, body, ttlSeconds);
            return originalJson(body);
        };
        next();
    };
};
exports.cacheMiddleware = cacheMiddleware;
exports.cacheClient = cache;
//# sourceMappingURL=cache.js.map