import express from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { Request, Response, NextFunction } from "express";
import registerRoutes from "./src/routes";

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// Serve Swagger UI
const swaggerDocument = yaml.load(fs.readFileSync("./openapi.yaml", "utf8")) as object;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register routes with prefixes
registerRoutes(app);

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  res.status(err.status || 500).json({
    status: 'fail',
    message: err.message || 'Internal Server Error',
  });
});


export default app;