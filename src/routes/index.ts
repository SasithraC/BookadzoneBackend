import { Express } from "express";
import { registerRoutes as configureRoutes } from "./routeConfig";

export default function registerRoutes(app: Express) {
  configureRoutes(app);
}

