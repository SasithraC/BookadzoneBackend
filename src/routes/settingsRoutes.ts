import { Router } from "express";
import settingsController from "../controllers/settingsController";
import upload from "../utils/fileUpload";
const router = Router();

// Get all settings
router.get("/", (req, res, next) => settingsController.getSettings(req, res, next));
// Update all settings with file upload for siteLogo and favicon
router.put(
	"/",
	upload.fields([
		{ name: "siteLogo", maxCount: 1 },
		{ name: "favicon", maxCount: 1 }
	]),
	(req, res, next) => settingsController.updateSettings(req, res, next)
);

export default router;
