import { Request, Response } from "express";
import authenticationService from "../services/authenticationService";
import { HTTP_RESPONSE, HTTP_STATUS_CODE } from "../utils/httpResponse";
import { NextFunction } from "express";
import User from "../models/userModel";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

class AuthenticationController {
  public async authLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authData = await authenticationService.authLogin(req.body);
      const csrfToken = (req as any).csrfToken?.();

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Logged in successfully",
        ...authData,
        csrfToken
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({ status: HTTP_RESPONSE.FAIL, message: "No Bearer Token" });
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({ status: HTTP_RESPONSE.FAIL, message: "Token not found" });
        return;
      }

      const authData = await authenticationService.refreshToken(token);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Token refreshed successfully",
        ...authData,
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Email is required"
        });
        return;
      }

      await authenticationService.forgotPassword(email);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "If a matching account was found, a password reset email has been sent"
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Token and password are required"
        });
        return;
      }

      await authenticationService.resetPassword(token, password);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Password has been reset successfully"
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found"
        });
        return;
      }

      await authenticationService.updateProfile(userId, { email, name });
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Profile updated successfully",
        data: { email, name }
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found"
        });
        return;
      }

      await authenticationService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Password changed successfully"
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('Request user object:', req.user);
      const userId = req.user?.id;
      
      if (!userId) {
        console.log('No user ID in request');
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found"
        });
        return;
      }

      // Use the repository to get user data
      const user = await User.findOne({ _id: userId })
        .select("_id email role status name")
        .lean();
      
      console.log('Found user:', user);
      
      if (!user) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found"
        });
        return;
      }

      // Generate new CSRF token for the response
      const csrfToken = (req as any).csrfToken?.();

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: user,
        csrfToken
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new AuthenticationController();
