// import { Router } from "express";
// import multer from "multer";
// import categoryController from "../controllers/categoryController";


// const router = Router();
// const upload = multer({ dest: "uploads/" }); // store files in /uploads

// router.post("/", upload.single('photo'), (req, res, next) => categoryController.createCategory(req, res, next));
// router.get("/", (req, res, next) => categoryController.getAllCategorys(req, res, next));
// router.get("/getcategoryById/:id", (req, res, next) => categoryController.getCategoryById(req, res, next));
// router.put("/updatecategory/:id", upload.single('photo'), (req, res, next) => categoryController.updateCategory(req, res, next));
// router.delete("/softDeletecategory/:id", (req, res, next) => categoryController.softDeleteCategory(req, res, next));
// router.patch('/togglestatus/:id', (req, res, next) => categoryController.toggleCategoryStatus(req, res, next));
// router.patch('/trash/', (req, res, next) => categoryController.getAllTrashCategorys(req, res, next));
// router.patch('/restore/:id', (req, res, next) => categoryController.restoreCategory(req, res, next));
// router.delete('/permanentDelete/:id', (req, res, next) => categoryController.deleteCategoryPermanently(req, res, next));

// export default router;


import { Router, Request, Response, NextFunction } from 'express';
// import FooterInfoController from '../controllers/footerInfoController';
import categoryController from '../controllers/categoryController';
import { upload } from '../utils/fileUpload';

const router = Router();

// Extend Request interface to include managementName
interface CustomRequest extends Request {
  managementName?: string;
}

// Middleware to set managementName
const setManagementName = (req: CustomRequest, res: Response, next: NextFunction) => {
  req.managementName = 'category'; // Hardcode to 'category' for consistency
  console.log('setManagementName: managementName set to:', req.managementName);
  next();
};

router.post('/', setManagementName, upload.single('photo'), categoryController.createCategory);
router.get('/', categoryController.getCategory);
router.get('/getcategoryById/:id', categoryController.getCategoryById);
router.put('/updatecategory/:id', setManagementName, upload.single('photo'), categoryController.updateCategory);
router.delete('/softDeletecategory/:id', categoryController.softDeleteCategory);
router.patch('/togglestatus/:id', categoryController.toggleCategoryStatus);
router.get('/trash/', categoryController.getAllTrashCategorys);
router.patch('/restore/:id', categoryController.restoreCategory);
router.delete('/permanentDelete/:id', categoryController.deleteCategoryPermanently);

export default router;