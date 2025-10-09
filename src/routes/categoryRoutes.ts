import { Router, Request, Response, NextFunction } from "express";
interface categoryRequest extends Request {
  managementName?: string;
}
import categoryController from "../controllers/categoryController";
import { upload } from "../utils/fileUpload"; 
const router = Router();

const setBannerManagementName = (req: categoryRequest, res: Response, next: NextFunction) => {
    req.managementName = 'category';
    next();
};

router.post(
  "/",
    setBannerManagementName,
  upload.fields([
    { name: "photo", maxCount: 1 },
  ]),
  (req, res, next) => categoryController.createCategory(req, res, next)
);
router.get("/", (req, res, next) => categoryController.getCategory(req, res, next));
router.get("/trash", (req, res, next) => categoryController.getAllTrashCategorys(req, res, next));
router.get("/:id", (req, res, next) => categoryController.getCategoryById(req, res, next));
router.put(
  "/:id",
    setBannerManagementName,
  upload.fields([
    { name: "photo", maxCount: 1 },
  ]),
  (req, res, next) => categoryController.updateCategory(req, res, next)
);

router.delete("/softDelete/:id", (req, res, next) => categoryController.softDeleteCategory(req, res, next));
router.patch("/restore/:id", (req, res, next) => categoryController.restoreCategory(req, res, next));
router.patch("/toggleStatus/:id", (req, res, next) => categoryController.toggleCategoryStatus(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => categoryController.deleteCategoryPermanently(req, res, next));

export default router;
