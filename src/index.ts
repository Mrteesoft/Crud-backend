import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { connectToDatabase } from "./utils/db";
import authRoutes from "./routes/authRoutes";
import merchantRoutes from "./routes/merchantRoutes";
import purchaseRoutes from "./routes/purchaseRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { swaggerSpec } from "./utils/swagger";
import { loadInstances } from "./instanceLoader";
import { getLogger } from "./utils/logger";
import { httpLogger } from "./middlewares/httpLogger";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const apiBase = "/api/v1";
const log = getLogger("Server");

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(`${apiBase}/auth`, authRoutes);
app.use(`${apiBase}/merchants`, merchantRoutes);
app.use(`${apiBase}/purchases`, purchaseRoutes);

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  await loadInstances([
    { name: "Database", init: () => connectToDatabase() },
    { name: "Routes", init: async () => {} },
    { name: "Swagger", init: async () => {} },
  ]);

  app.listen(PORT, () => {
    log.info("Started on :%d", PORT);
    log.info("Swagger UI available at http://localhost:%d/api/docs", PORT);
    log.info("Base API: http://localhost:%d%s", PORT, apiBase);
  });
}

bootstrap().catch((err) => {
  getLogger("Bootstrap").error("Startup failed", err);
  process.exit(1);
});