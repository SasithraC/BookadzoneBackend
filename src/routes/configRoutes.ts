import { Router } from "express";
import configController from "../controllers/configController";
const router = Router();

router.post("/", (req, res, next) => configController.createConfig(req, res, next));
router.get("/", (req, res, next) => configController.getAllConfigs(req, res, next));
router.get("/getConfigById/:id", (req, res, next) => configController.getConfigById(req, res, next));
router.put("/updateConfig/:id", (req, res, next) => configController.updateConfig(req, res, next));
router.delete("/softDeleteConfig/:id", (req, res, next) => configController.softDeleteConfig(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => configController.toggleStatus(req, res, next));
router.get('/trash/', (req, res, next) => configController.getAllTrashConfigs(req, res, next));
router.patch('/restore/:id', (req, res, next) => configController.restoreConfig(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => configController.deleteConfigPermanently(req, res, next));

export default router;