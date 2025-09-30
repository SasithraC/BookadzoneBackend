import { Router } from "express";
import NewsLetterController from "../controllers/newsLetterController";
const router = Router();

router.post("/", (req, res, next) => NewsLetterController.createNewsLetter(req, res, next));
router.get("/", (req, res, next) => NewsLetterController.getAllNewsLetters(req, res, next));
router.get("/getNewsLetterById/:id?", (req, res, next) => NewsLetterController.getNewsLetterById(req, res, next));
router.put("/updateNewsLetter/:id?", (req, res, next) => NewsLetterController.updateNewsLetter(req, res, next));
router.delete("/softDeleteNewsLetter/:id?", (req, res, next) => NewsLetterController.softDeleteNewsLetter(req, res, next));
router.patch('/togglestatus/:id?', (req, res, next) => NewsLetterController.toggleNewsLetterStatus(req, res, next));
router.get('/trash/', (req, res, next) => NewsLetterController.getAllTrashNewsLetters(req, res, next));
router.patch('/restore/:id?', (req, res, next) => NewsLetterController.restoreNewsLetter(req, res, next));
router.delete('/permanentDelete/:id?', (req, res, next) => NewsLetterController.deleteNewsLetterPermanently(req, res, next));
export default router;