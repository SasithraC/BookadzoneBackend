
import { Router, Response, NextFunction } from 'express';

// Extend Request type to allow managementName
import { Request } from 'express';
interface BannerRequest extends Request {
	managementName?: string;
}
import { BannerController } from '../controllers/bannerController';
import { upload } from '../utils/fileUpload';

const router = Router();
const controller = new BannerController();

// Middleware to set managementName for banner
const setBannerManagementName = (req: BannerRequest, res: Response, next: NextFunction) => {
	req.managementName = 'banner';
	next();
};

router.get('/', (req, res) => controller.getAll(req, res));
router.put(
	'/',
	setBannerManagementName,
	upload.fields([
		{ name: 'homepage.bannerOne.imageOne', maxCount: 1 },
		{ name: 'homepage.bannerOne.imageTwo', maxCount: 1 },
		{ name: 'homepage.bannerOne.imageThree', maxCount: 1 },
		{ name: 'homepage.bannerTwo.backgroundImage', maxCount: 1 },
		{ name: 'aboutBanner.bannerOne.backgroundImage', maxCount: 1 },
		{ name: 'aboutBanner.bannerTwo.backgroundImage', maxCount: 1 },
		{ name: 'aboutBanner.bannerOne.images', maxCount: 4 },
		{ name: 'aboutBanner.bannerTwo.images', maxCount: 4 }
	]),
	(req, res, next) => {
		console.log('Incoming file fields:', Object.keys(req.files || {}));
		next();
	},
	(req, res) => controller.update(req, res)
);

export default router;
