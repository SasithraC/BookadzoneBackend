import { Request, Response } from "express";
import authenticationService from "../services/authenticationService";
import { HTTP_RESPONSE, HTTP_STATUS_CODE } from "../utils/httpResponse";
import { NextFunction } from "express";

class AuthenticationController {
  public async authLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authData = await authenticationService.authLogin(req.body);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Logged in successfully",
        ...authData,
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
}

export default new AuthenticationController();
