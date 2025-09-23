import { Express } from "express";

// Routes >
import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import categoryRoutes from "./categoryRoutes"

import configRoutes from "./configRoutes";
import settingsRoutes from "./settingsRoutes";
import { authenticate } from "../middleware/authentication";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/faqs", authenticate, faqRoutes);
  app.use("/api/v1/categorys", authenticate, categoryRoutes);

  app.use("/api/v1/configs", authenticate, configRoutes);
  app.use("/api/v1/settings", authenticate, settingsRoutes);
}

