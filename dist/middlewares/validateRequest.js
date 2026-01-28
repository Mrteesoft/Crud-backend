"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
        return res.status(400).json({ errors });
    }
    req.body = result.data;
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map