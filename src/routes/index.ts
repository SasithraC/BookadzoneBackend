

import { Express } from "express";
import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import footerInfoRoutes from "./footerInfo";
import configRoutes from "./configRoutes";
import { authenticate } from "../middleware/authentication";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/faqs", authenticate, faqRoutes);
  app.use("/api/v1/footerinfo", authenticate, footerInfoRoutes);
  app.use("/api/v1/configs", authenticate, configRoutes);
}

