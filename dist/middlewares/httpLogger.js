"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = httpLogger;
const logger_1 = require("../utils/logger");
const log = (0, logger_1.getLogger)('HTTP');
function httpLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const userId = req.user?.id;
        log.info('%s %s %d %dms%s', req.method, req.originalUrl, res.statusCode, ms, userId ? ` user=${userId}` : '');
    });
    next();
}
//# sourceMappingURL=httpLogger.js.map