import { Router } from "express";
import authenticationController from "../controllers/authenticationController";

const router: Router = Router();



router.post("/login", (req, res, next) => authenticationController.authLogin(req, res, next));
router.post("/refresh", (req, res, next) => authenticationController.refreshToken(req, res, next));

export default router;
