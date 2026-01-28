"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseLogger = void 0;
exports.getLogger = getLogger;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, errors, splat, metadata } = winston_1.default.format;
const neatLine = printf((info) => {
    const time = info.timestamp ? String(info.timestamp).slice(11, 19) : "";
    const level = (info.level || "").toUpperCase().padEnd(5);
    const ctx = (info.context ?? "App").toString().padEnd(14);
    const msg = info.message ?? "";
    const meta = info.metadata && Object.keys(info.metadata).length ? ` ${JSON.stringify(info.metadata)}` : "";
    const stack = info.stack ? `\n${info.stack}` : "";
    return `[${time}] [${ctx}] ${level} ${msg}${meta}${stack}`;
});
exports.baseLogger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    defaultMeta: { service: process.env.SERVICE_NAME ?? "bnpl-api" },
    format: combine(errors({ stack: true }), splat(), metadata({ fillExcept: ["message", "level", "timestamp", "label", "context", "stack"] }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" })),
    transports: [
        new winston_1.default.transports.Console({ format: neatLine }),
    ],
});
function getLogger(context) {
    return exports.baseLogger.child({ context });
}
//# sourceMappingURL=logger.js.map