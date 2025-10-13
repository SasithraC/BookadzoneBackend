import { Router } from "express";
import pagesController from "../controllers/pageController";
const router = Router();

router.post("/", (req, res, next) => pagesController.createPage(req, res, next));
router.get("/", (req, res, next) => pagesController.getAllPages(req, res, next));
router.get("/getPageById/:id?", (req, res, next) => pagesController.getPageById(req, res, next));
router.put("/updatePage/:id?", (req, res, next) => pagesController.updatePage(req, res, next));
router.delete("/softDeletePage/:id?", (req, res, next) => pagesController.softDeletePage(req, res, next));
router.patch('/togglestatus/:id?', (req, res, next) => pagesController.togglePageStatus(req, res, next));
router.get('/trash/', (req, res, next) => pagesController.getAllTrashPages(req, res, next));
router.patch('/restore/:id?', (req, res, next) => pagesController.restorePage(req, res, next));
router.delete('/permanentDelete/:id?', (req, res, next) => pagesController.deletePagePermanently(req, res, next));
export default router;
