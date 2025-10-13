import { Router, Request, Response, NextFunction } from "express";
interface FooterRequest extends Request {
  managementName?: string;
}
import FooterInfoController from '../controllers/footerInfoController';
import { upload } from "../utils/fileUpload"; 
const router = Router();

const setFooterManagementName = (req: FooterRequest, res: Response, next: NextFunction) => {
    req.managementName = 'footer';
    next();
};

router.post(
  "/",
  setFooterManagementName,
  upload.fields([
    { name: "logo", maxCount: 1 },
  ]),
  (req, res, next) => FooterInfoController.createFooterInfo(req, res, next)
);

router.get("/", (req, res, next) => FooterInfoController.getFooterInfo(req, res, next));
router.get("/getfooterinfoById/:id", (req, res, next) => FooterInfoController.getFooterInfoById(req, res, next));

router.put(
  "/updatefooterinfo/:id",
  setFooterManagementName,
  upload.fields([
    { name: "logo", maxCount: 1 },
  ]),
  (req, res, next) => FooterInfoController.updateFooterInfo(req, res, next)
);

router.delete("/softDeletefooterinfo/:id", (req, res, next) => FooterInfoController.softDeleteFooterInfo(req, res, next));
router.patch("/restore/:id", (req, res, next) => FooterInfoController.restoreFooterInfo(req, res, next));
router.patch("/togglestatus/:id", (req, res, next) => FooterInfoController.toggleFooterInfoStatus(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => FooterInfoController.deleteFooterInfoPermanently(req, res, next));
router.get('/trash/', FooterInfoController.getAllTrashFooterInfos);

export default router;
