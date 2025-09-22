import { Express } from "express";

// Routes >
import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import categoryRoutes from "./categoryRoutes"

import { authenticate } from "../middleware/authentication";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/faqs", authenticate, faqRoutes);
  app.use("/api/v1/categorys", authenticate, categoryRoutes);

}

