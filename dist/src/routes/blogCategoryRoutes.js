"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogCategoryController_1 = __importDefault(require("../controllers/blogCategoryController"));
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => blogCategoryController_1.default.createBlogCategory(req, res, next));
router.get("/", (req, res, next) => blogCategoryController_1.default.getAllBlogCategories(req, res, next));
router.get("/getblogCategoryById/:id", (req, res, next) => blogCategoryController_1.default.getBlogCategoryById(req, res, next));
router.put("/updateblogCategory/:id", (req, res, next) => blogCategoryController_1.default.updateBlogCategory(req, res, next));
router.delete("/softDeleteblogCategory/:id", (req, res, next) => blogCategoryController_1.default.softDeleteBlogCategory(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => blogCategoryController_1.default.toggleBlogCategoryStatus(req, res, next));
router.get('/trash/', (req, res, next) => blogCategoryController_1.default.getAllTrashBlogCategories(req, res, next));
router.patch('/trash/', (req, res, next) => blogCategoryController_1.default.restoreBlogCategory(req, res, next));
router.patch('/restore/:id', (req, res, next) => blogCategoryController_1.default.restoreBlogCategory(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => blogCategoryController_1.default.deleteBlogCategoryPermanently(req, res, next));
exports.default = router;
