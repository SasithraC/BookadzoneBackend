import { Router } from "express";
import multer from "multer";
import categoryController from "../controllers/categoryController";


const router = Router();
const upload = multer({ dest: "uploads/" }); // store files in /uploads

router.post("/",upload.fields([{ name: 'photo', maxCount: 1 }]),  (req, res, next) => categoryController.createCategory(req, res, next));
router.get("/", (req, res, next) => categoryController.getAllCategorys(req, res, next));
router.get("/getcategoryById/:id", (req, res, next) => categoryController.getCategoryById(req, res, next));
router.put("/updatecategory/:id",upload.fields([{ name: 'photo', maxCount: 1 }]), (req, res, next) => categoryController.updateCategory(req, res, next));
router.delete("/softDeletecategory/:id", (req, res, next) => categoryController.softDeleteCategory(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => categoryController.toggleCategoryStatus(req, res, next));
router.patch('/trash/', (req, res, next) => categoryController.getAllTrashCategorys(req, res, next));
router.patch('/restore/:id', (req, res, next) => categoryController.restoreCategory(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => categoryController.deleteCategoryPermanently(req, res, next));

export default router;