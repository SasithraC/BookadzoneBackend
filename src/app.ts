import express from "express";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as yaml from "js-yaml";
import path from 'path';
import registerRoutes from "./routes";
import { setupMiddleware } from "./middleware/setup";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Initialize all middleware
setupMiddleware(app);

// Initialize database connection
import dbConnection from './config/database';
dbConnection.connect().catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

registerRoutes(app);




app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '..', 'uploads'))
);

// Serve Swagger UI
const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, '../api-docs/bundled.yaml'), 'utf8')) as object;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register routes with prefixes
registerRoutes(app);

// Centralized error handler
// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  
  // Default to 500 if no status is provided
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;