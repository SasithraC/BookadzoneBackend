import { Router } from "express";
import blogCategoryController from "../controllers/blogCategoryController";
const router = Router();

router.post("/", (req, res, next) => blogCategoryController.createBlogCategory(req, res, next));
router.get("/", (req, res, next) => blogCategoryController.getAllBlogCategories(req, res, next));
router.get("/getblogCategoryById/:id", (req, res, next) => blogCategoryController.getBlogCategoryById(req, res, next));
router.put("/updateblogCategory/:id", (req, res, next) => blogCategoryController.updateBlogCategory(req, res, next));
router.delete("/softDeleteblogCategory/:id", (req, res, next) => blogCategoryController.softDeleteBlogCategory(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => blogCategoryController.toggleBlogCategoryStatus(req, res, next));
router.get('/trash/', (req, res, next) => blogCategoryController.getAllTrashBlogCategories(req, res, next));
router.patch('/trash/', (req, res, next) => blogCategoryController.restoreBlogCategory(req, res, next));
router.patch('/restore/:id', (req, res, next) => blogCategoryController.restoreBlogCategory(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => blogCategoryController.deleteBlogCategoryPermanently(req, res, next));
export default router;