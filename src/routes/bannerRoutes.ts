import { Router } from 'express';
import { BannerController } from '../controllers/bannerController';
import upload from '../utils/fileUpload';

const router = Router();
const controller = new BannerController();

// Get all banner management data
router.get('/', (req, res) => controller.getAll(req, res));

// Update banner management data with file upload for images
router.put(
	'/',
		upload.fields([
			{ name: 'homepage.bannerOne.image1', maxCount: 1 },
			{ name: 'homepage.bannerOne.image2', maxCount: 1 },
			{ name: 'homepage.bannerOne.image3', maxCount: 1 },
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
