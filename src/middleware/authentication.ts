import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS_CODE, HTTP_RESPONSE } from "../utils/httpResponse";

interface DecodedToken extends JwtPayload {
  _id: string;
  id: string;
  email: string;
  role: "super-admin" | "admin" | "user";
}

const excludedPaths: string[] = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/forgotpassword",
  "/api/v1/auth/resetpassword",
];

export const authenticate = async (
  req: Request & { id?: string; email?: string; accountdetails?: any },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const apiPath = req.path;
    if (excludedPaths.includes(apiPath)) {
      return next();
    }

   
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Bearer token missing",
      });
      return;
    }

  
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Bearer token missing",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Invalid or expired token",
      });
      return;
    }
    const User = require("../models/userModel").default;

    const userId = decoded._id || decoded.id;
    const user = await User.findOne({ _id: userId }).select("role status isDeleted");
    if (!user) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "User not found. Contact admin.",
      });
      return;
    }

    if (user.isDeleted) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Account has been deleted",
      });
      return;
    }

    if (user.status === "inactive") {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Account is blocked",
      });
      return;
    }

    req.id = user._id;
    req.email = decoded.email;
    req.accountdetails = decoded;
    next();
  } catch (error: any) {
    res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
      status: HTTP_RESPONSE.FAIL,
      message: "Invalid or expired token",
    });
  }
};