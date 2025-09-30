import { Router, Request, Response, NextFunction } from "express";
interface agencyRequest extends Request {
	managementName?: string;
}
import agencyController from "../controllers/agencyController";
import { upload } from "../utils/fileUpload"; 
const router = Router();

const setBannerManagementName = (req: agencyRequest, res: Response, next: NextFunction) => {
    req.managementName = 'agency';
    next();
};

router.post(
	"/",
    setBannerManagementName,
	upload.fields([
		{ name: "agencyLogo", maxCount: 1 },
		{ name: "photo", maxCount: 1 },
		{ name: "uploadIdProof", maxCount: 1 },
		{ name: "uploadBusinessProof", maxCount: 1 }
	]),
	(req, res, next) => agencyController.createAgency(req, res, next)
);
router.get("/", (req, res, next) => agencyController.getAllAgencies(req, res, next));
router.get("/trash", (req, res, next) => agencyController.getAllTrashAgencies(req, res, next));
router.get("/:id", (req, res, next) => agencyController.getAgencyById(req, res, next));
router.put(
	"/:id",
    setBannerManagementName,
	upload.fields([
		{ name: "agencyLogo", maxCount: 1 },
		{ name: "photo", maxCount: 1 },
		{ name: "uploadIdProof", maxCount: 1 },
		{ name: "uploadBusinessProof", maxCount: 1 }
	]),
	(req, res, next) => agencyController.updateAgency(req, res, next)
);

router.delete("/softDelete/:id", (req, res, next) => agencyController.deleteAgency(req, res, next));
router.patch("/restore/:id", (req, res, next) => agencyController.restoreAgency(req, res, next));
router.patch("/toggleStatus/:id", (req, res, next) => agencyController.toggleAgencyStatus(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => agencyController.deleteAgencyPermanently(req, res, next));

export default router;
