import { Router } from "express";
import BlogCategoryController from "../controllers/blogCategoryController";
const router = Router();

router.post("/", (req, res, next) => BlogCategoryController.createCategory(req, res, next));
router.get("/", (req, res, next) => BlogCategoryController.getAllCategories(req, res, next));
router.get("/getCategoryById/:id", (req, res, next) => BlogCategoryController.getCategoryById(req, res, next));
router.put("/updateCategory/:id", (req, res, next) => BlogCategoryController.updateCategory(req, res, next));
router.delete("/deleteCategory/:id", (req, res, next) => BlogCategoryController.deleteCategory(req, res, next));
router.patch("/toggleStatus/:id", (req, res, next) => BlogCategoryController.toggleCategoryStatus(req, res, next));

export default router;