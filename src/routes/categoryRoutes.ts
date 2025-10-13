


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