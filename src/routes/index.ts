import { Express } from "express";

// Routes >
import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import blogRoutes from "./blogCategoryRoutes"
import categoryRoutes from "./categoryRoutes"
import blogsRoutes from "./blogsRoutes"
import newLetterRoutes from "./newLetterRoutes";
import pagesRoutes from "./pagesRoutes";

import footerInfoRoutes from "./footerInfoRoutes";
import configRoutes from "./configRoutes";
import settingsRoutes from "./settingsRoutes";
import { authenticate } from "../middleware/authentication";
import bannerManagementRoutes from "./bannerRoutes";
import { upload } from "../utils/fileUpload";
import uploadTemplateImagesRoutes from "./uploadEditorImages";

import agencyRoutes from "./agencyRoutes";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/faqs", authenticate, faqRoutes);
  app.use("/api/v1/blogcategory", authenticate, blogRoutes);

  app.use("/api/v1/category", authenticate, categoryRoutes); // Protected: requires authentication

  app.use("/api/v1/blog", authenticate, blogsRoutes); // Protected: requires authentication


  app.use("/api/v1/newsletters", authenticate, newLetterRoutes);
  app.use("/api/v1/pages", authenticate, pagesRoutes);
  app.use("/api/v1/footerinfo", authenticate, footerInfoRoutes);
  app.use("/api/v1/configs", authenticate, configRoutes);
  app.use("/api/v1/settings", authenticate, settingsRoutes);
  app.use("/api/v1/banners", authenticate, bannerManagementRoutes);
  app.use("/api/v1/editer/image", authenticate, uploadTemplateImagesRoutes);
  app.use("/api/v1/agencies", authenticate, agencyRoutes);
}

