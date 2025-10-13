// controllers/authenticationController.ts
import { Request, Response, NextFunction } from "express";
import authenticationService from "../services/authenticationService";
import { HTTP_RESPONSE, HTTP_STATUS_CODE } from "../utils/httpResponse";

class AuthenticationController {
  public async authLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, data, expiresIn, menus } = await authenticationService.authLogin(req.body);
    
      const response = {
        status: HTTP_RESPONSE.SUCCESS,
        message: "Logged in successfully",
        token,
        data,
        expiresIn,
        menus,
      };
      res.status(200).json(response);
    } catch (err: any) {
      next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "No Bearer Token",
        });
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Token not found",
        });
        return;
      }

      const { token: newToken, data, expiresIn, menus } = await authenticationService.refreshToken(token);
      
      const response = {
        status: HTTP_RESPONSE.SUCCESS,
        message: "Token refreshed successfully",
        token: newToken,
        data,
        expiresIn,
        menus,
      };
      res.status(200).json(response);
    } catch (err: any) {
      next(err);
    }
  }
}

export default new AuthenticationController();