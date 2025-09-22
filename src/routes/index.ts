

import { Express } from "express";
import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import newLetterRoutes from "./newLetterRoutes";

import { authenticate } from "../middleware/authentication";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/faqs", authenticate, faqRoutes);
  app.use("/api/v1/newsletters", authenticate, newLetterRoutes);
}

