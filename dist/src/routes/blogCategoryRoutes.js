"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController_1 = __importDefault(require("../controllers/blogController"));
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => blogController_1.default.createCategory(req, res, next));
router.get("/", (req, res, next) => blogController_1.default.getAllCategories(req, res, next));
router.get("/getCategoryById/:id", (req, res, next) => blogController_1.default.getCategoryById(req, res, next));
router.put("/updateCategory/:id", (req, res, next) => blogController_1.default.updateCategory(req, res, next));
router.delete("/deleteCategory/:id", (req, res, next) => blogController_1.default.deleteCategory(req, res, next));
router.patch("/toggleStatus/:id", (req, res, next) => blogController_1.default.toggleCategoryStatus(req, res, next));
exports.default = router;
