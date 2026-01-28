import winston from "winston";

const { combine, timestamp, printf, errors, splat, metadata } = winston.format;

const neatLine = printf((info: any) => {
  const time = info.timestamp ? String(info.timestamp).slice(11, 19) : "";
  const level = (info.level || "").toUpperCase().padEnd(5);
  const ctx = (info.context ?? "App").toString().padEnd(14);
  const msg = info.message ?? "";
  const meta = info.metadata && Object.keys(info.metadata).length ? ` ${JSON.stringify(info.metadata)}` : "";
  const stack = info.stack ? `\n${info.stack}` : "";
  return `[${time}] [${ctx}] ${level} ${msg}${meta}${stack}`;
});

export const baseLogger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  defaultMeta: { service: process.env.SERVICE_NAME ?? "bnpl-api" },
  format: combine(
    errors({ stack: true }),
    splat(),
    metadata({ fillExcept: ["message", "level", "timestamp", "label", "context", "stack"] }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  transports: [
    new winston.transports.Console({ format: neatLine }),
  ],
});

export function getLogger(context: string) {
  return baseLogger.child({ context });
}