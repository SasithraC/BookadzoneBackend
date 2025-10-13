import { Router } from "express";
import authenticationController from "../controllers/authenticationController";
import { loginRateLimiter } from "../middleware/rateLimiter";
import { validateCSRFToken } from "../middleware/csrf";
import { validateRequest } from "../middleware/validation";
import { loginSchema, resetPasswordSchema, forgotPasswordSchema, profileUpdateSchema, passwordChangeSchema } from "../validators/authSchemas";

const router: Router = Router();

// Apply rate limiting and validation to login route
router.post(
    "/login",
    loginRateLimiter,
    validateRequest(loginSchema),
    authenticationController.authLogin
);

// Apply CSRF protection and validation to token refresh
router.post(
    "/refresh",
    validateCSRFToken,
    authenticationController.refreshToken
);

// Apply rate limiting and validation to password reset routes
router.post(
    "/forgot-password",
    loginRateLimiter,
    validateRequest(forgotPasswordSchema),
    authenticationController.forgotPassword
);

router.post(
    "/reset-password",
    loginRateLimiter,
    validateRequest(resetPasswordSchema),
    authenticationController.resetPassword
);

// Profile management routes (protected by authentication)
import { authenticate } from "../middleware/authentication";

router.get(
    "/me",
    authenticate,
    authenticationController.getCurrentUser
);

router.put(
    "/profile",
    authenticate,
    validateCSRFToken,
    validateRequest(profileUpdateSchema),
    authenticationController.updateProfile
);

router.put(
    "/change-password",
    authenticate,
    validateCSRFToken,
    validateRequest(passwordChangeSchema),
    authenticationController.changePassword
);

export default router;
