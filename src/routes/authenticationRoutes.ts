import { Router } from "express";
import authenticationController from "../controllers/authenticationController";
import { loginRateLimiter } from "../middleware/rateLimiter";
import { validateRequest } from "../middleware/validation";
import {
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  profileUpdateSchema,
  passwordChangeSchema,
} from "../validators/authSchemas";
import { authenticate } from "../middleware/authentication";
import { validateCSRFToken } from "../middleware/csrf";

const router: Router = Router();

/**
 * 🚪 PUBLIC ROUTES (No Auth / No CSRF)
 */
router.post(
  "/login",
  loginRateLimiter,
  validateRequest(loginSchema),
  authenticationController.authLogin
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authenticationController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authenticationController.resetPassword
);

/**
 * 🔐 PROTECTED ROUTES (Require Auth + CSRF)
 */
router.post(
  "/refresh",
  validateCSRFToken,
  authenticate,
  authenticationController.refreshToken
);

router.get(
  "/me",
  authenticate,
  validateCSRFToken,
  authenticationController.getCurrentUser
);

router.put(
  "/update-profile",
  authenticate,
  validateCSRFToken,
  validateRequest(profileUpdateSchema),
  authenticationController.updateProfile
);

router.post(
  "/change-password",
  authenticate,
  validateCSRFToken,
  validateRequest(passwordChangeSchema),
  authenticationController.changePassword
);

export default router;
