import { Router, Request, Response, NextFunction } from 'express';
import FooterInfoController from '../controllers/footerInfoController';
import { upload } from '../utils/fileUpload';

const router = Router();

// Extend Request interface to include managementName
interface CustomRequest extends Request {
  managementName?: string;
}

// Middleware to set managementName
const setManagementName = (req: CustomRequest, res: Response, next: NextFunction) => {
  req.managementName = 'footer'; // Hardcode to 'footer' for consistency
  console.log('setManagementName: managementName set to:', req.managementName);
  next();
};

router.post('/', setManagementName, upload.single('logo'), FooterInfoController.createFooterInfo);
router.get('/', FooterInfoController.getFooterInfo);
router.get('/getfooterinfoById/:id', FooterInfoController.getFooterInfoById);
router.put('/updatefooterinfo/:id', setManagementName, upload.single('logo'), FooterInfoController.updateFooterInfo);
router.delete('/softDeletefooterinfo/:id', FooterInfoController.softDeleteFooterInfo);
router.patch('/togglestatus/:id', FooterInfoController.toggleFooterInfoStatus);
router.get('/trash/', FooterInfoController.getAllTrashFooterInfos);
router.patch('/restore/:id', FooterInfoController.restoreFooterInfo);
router.delete('/permanentDelete/:id', FooterInfoController.deleteFooterInfoPermanently);

export default router;