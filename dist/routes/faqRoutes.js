"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faqController_1 = __importDefault(require("../controllers/faqController"));
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => faqController_1.default.createFaq(req, res, next));
router.get("/", (req, res, next) => faqController_1.default.getAllFaqs(req, res, next));
router.get("/getFaqById/:id", (req, res, next) => faqController_1.default.getFaqById(req, res, next));
router.put("/updateFaq/:id", (req, res, next) => faqController_1.default.updateFaq(req, res, next));
router.delete("/softDeleteFaq/:id", (req, res, next) => faqController_1.default.softDeleteFaq(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => faqController_1.default.toggleFaqStatus(req, res, next));
router.patch('/trash/', (req, res, next) => faqController_1.default.getAllTrashFaqs(req, res, next));
router.patch('/restore/:id', (req, res, next) => faqController_1.default.restoreFaq(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => faqController_1.default.deleteFaqPermanently(req, res, next));
exports.default = router;
