import { Router } from "express";
import FooterInfoController from "../controllers/footerInfoController";
import upload from "../utils/fileUpload";

const router = Router();

router.post('/', upload.single('logo'), FooterInfoController.createFooterInfo);
router.get("/", FooterInfoController.getFooterInfo);
router.get("/getfooterinfoById/:id", FooterInfoController.getFooterInfoById);
router.put("/updatefooterinfo/:id", upload.single('logo'), FooterInfoController.updateFooterInfo);
router.delete("/softDeletefooterinfo/:id", FooterInfoController.softDeleteFooterInfo);
router.patch('/togglestatus/:id', FooterInfoController.toggleFooterInfoStatus);
router.patch('/trash/', FooterInfoController.getAllTrashFooterInfos);
router.patch('/restore/:id', FooterInfoController.restoreFooterInfo);
router.delete('/permanentDelete/:id', FooterInfoController.deleteFooterInfoPermanently);

export default router;