"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingsController_1 = __importDefault(require("../controllers/settingsController"));
const fileUpload_1 = require("../utils/fileUpload");
const router = (0, express_1.Router)();
// Middleware to set managementName for settings
const setSettingsManagementName = (req, res, next) => {
    req.managementName = 'settings';
    next();
};
// Get all settings
router.get("/", (req, res, next) => settingsController_1.default.getSettings(req, res, next));
// Update all settings with file upload for siteLogo and favicon
router.put("/", setSettingsManagementName, fileUpload_1.upload.fields([
    { name: "siteLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: 'ogImage', maxCount: 1 }
]), (req, res, next) => settingsController_1.default.updateSettings(req, res, next));
exports.default = router;
