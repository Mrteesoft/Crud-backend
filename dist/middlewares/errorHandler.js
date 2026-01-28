"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
const log = (0, logger_1.getLogger)('Error');
function errorHandler(err, _req, res, _next) {
    log.error(err.message || 'Unhandled error', { stack: err.stack });
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
}
//# sourceMappingURL=errorHandler.js.map