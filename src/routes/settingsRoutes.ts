
import { Router, Request, Response, NextFunction } from "express";
import settingsController from "../controllers/settingsController";
import { upload } from "../utils/fileUpload";
const router = Router();

// Extend Request type to allow managementName
interface CustomRequest extends Request {
  managementName?: string;
}

// Middleware to set managementName for settings
const setSettingsManagementName = (req: CustomRequest, res: Response, next: NextFunction) => {
  req.managementName = 'settings';
  next();
};

// Get all settings
router.get("/", (req, res, next) => settingsController.getSettings(req, res, next));
// Update all settings with file upload for siteLogo and favicon
router.put(
  "/",
  setSettingsManagementName,
  upload.fields([
    { name: "siteLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: 'ogImage', maxCount: 1 }
  ]),
  (req, res, next) => settingsController.updateSettings(req, res, next)
);

export default router;
