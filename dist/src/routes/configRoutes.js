"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configController_1 = __importDefault(require("../controllers/configController"));
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => configController_1.default.createConfig(req, res, next));
router.get("/", (req, res, next) => configController_1.default.getAllConfigs(req, res, next));
router.get("/getConfigById/:id", (req, res, next) => configController_1.default.getConfigById(req, res, next));
router.put("/updateConfig/:id", (req, res, next) => configController_1.default.updateConfig(req, res, next));
router.delete("/softDeleteConfig/:id", (req, res, next) => configController_1.default.softDeleteConfig(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => configController_1.default.toggleStatus(req, res, next));
router.get('/trash/', (req, res, next) => configController_1.default.getAllTrashConfigs(req, res, next));
router.patch('/restore/:id', (req, res, next) => configController_1.default.restoreConfig(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => configController_1.default.deleteConfigPermanently(req, res, next));
exports.default = router;
