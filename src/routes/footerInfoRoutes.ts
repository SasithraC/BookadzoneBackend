import { Router, Request, Response, NextFunction } from 'express';
import FooterInfoController from '../controllers/footerInfoController';
import { upload } from '../utils/fileUpload';

const router = Router();

interface CustomRequest extends Request {
  managementName?: string;
}

const setFooterManagementName = (req: CustomRequest, res: Response, next: NextFunction) => {
  req.managementName = 'footer';
  next();
};


router.post('/', setFooterManagementName, upload.single('logo'), FooterInfoController.createFooterInfo);
router.get('/', FooterInfoController.getFooterInfo);
router.get('/getfooterinfoById/:id', FooterInfoController.getFooterInfoById);
router.put('/updatefooterinfo/:id', setFooterManagementName, upload.single('logo'), FooterInfoController.updateFooterInfo);
router.delete('/softDeletefooterinfo/:id', FooterInfoController.softDeleteFooterInfo);
router.patch('/togglestatus/:id', FooterInfoController.toggleFooterInfoStatus);
router.get('/trash/', FooterInfoController.getAllTrashFooterInfos);
router.patch('/restore/:id', FooterInfoController.restoreFooterInfo);
router.delete('/permanentDelete/:id', FooterInfoController.deleteFooterInfoPermanently);

export default router;