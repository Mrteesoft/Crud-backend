"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const db_1 = require("./utils/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const merchantRoutes_1 = __importDefault(require("./routes/merchantRoutes"));
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const notFound_1 = require("./middlewares/notFound");
const swagger_1 = require("./utils/swagger");
const instanceLoader_1 = require("./instanceLoader");
const logger_1 = require("./utils/logger");
const httpLogger_1 = require("./middlewares/httpLogger");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
const apiBase = "/api/v1";
const log = (0, logger_1.getLogger)("Server");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(httpLogger_1.httpLogger);
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use(`${apiBase}/auth`, authRoutes_1.default);
app.use(`${apiBase}/merchants`, merchantRoutes_1.default);
app.use(`${apiBase}/purchases`, purchaseRoutes_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
async function bootstrap() {
    await (0, instanceLoader_1.loadInstances)([
        { name: "Database", init: () => (0, db_1.connectToDatabase)() },
        { name: "Routes", init: async () => { } },
        { name: "Swagger", init: async () => { } },
    ]);
    app.listen(PORT, () => {
        log.info("Started on :%d", PORT);
        log.info("Swagger UI available at http://localhost:%d/api/docs", PORT);
        log.info("Base API: http://localhost:%d%s", PORT, apiBase);
    });
}
bootstrap().catch((err) => {
    (0, logger_1.getLogger)("Bootstrap").error("Startup failed", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map