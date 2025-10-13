"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const footerInfoController_1 = __importDefault(require("../controllers/footerInfoController"));
const fileUpload_1 = require("../utils/fileUpload");
const router = (0, express_1.Router)();
// Middleware to set managementName
const setManagementName = (req, res, next) => {
    req.managementName = 'footer'; // Hardcode to 'footer' for consistency
    console.log('setManagementName: managementName set to:', req.managementName);
    next();
};
router.post('/', setManagementName, fileUpload_1.upload.single('logo'), footerInfoController_1.default.createFooterInfo);
router.get('/', footerInfoController_1.default.getFooterInfo);
router.get('/getfooterinfoById/:id', footerInfoController_1.default.getFooterInfoById);
router.put('/updatefooterinfo/:id', setManagementName, fileUpload_1.upload.single('logo'), footerInfoController_1.default.updateFooterInfo);
router.delete('/softDeletefooterinfo/:id', footerInfoController_1.default.softDeleteFooterInfo);
router.patch('/togglestatus/:id', footerInfoController_1.default.toggleFooterInfoStatus);
router.get('/trash/', footerInfoController_1.default.getAllTrashFooterInfos);
router.patch('/restore/:id', footerInfoController_1.default.restoreFooterInfo);
router.delete('/permanentDelete/:id', footerInfoController_1.default.deleteFooterInfoPermanently);
exports.default = router;
