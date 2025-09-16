import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS_CODE, HTTP_RESPONSE } from "../utils/httpResponse";

interface DecodedToken extends JwtPayload {
  _id: string;
  id: string;
  email: string;
  role: "super-admin" | "admin";
}

const excludedPaths: string[] = [
  "auth/login",
  "auth/register",
  "auth/forgotpassword",
  "auth/resetpassword",
];

export const authenticate = async (
  req: Request & { id?: string; email?: string; accountdetails?: any },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Allow excluded paths without authentication
    const apiPath = req.path.replace("/api/v1/", "");
    if (excludedPaths.includes(apiPath)) {
      return next();
    }

    // Check Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Access Denied: No Bearer Token",
      });
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Token not found",
      });
      return;
    }

    // Load User model dynamically (to avoid circular dependencies)
    const User = require("../models/userModel").default;

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      if (!decoded) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Invalid Token. Please contact an admin",
        });
        return;
      }

      // Get user ID from decoded token
      const userId = decoded._id || decoded.id;

      // Find user in DB
      const user = await User.findOne({ _id: userId }).select("role status isDeleted");
      if (!user) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Please contact an admin",
        });
        return;
      }

      // Check if user is deleted or inactive
      if (user.isDeleted) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Account deleted",
        });
        return;
      }

      if (user.status === "inactive") {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Account blocked. Please contact an admin",
        });
        return;
      }

      // Check user role authorization
      if (user.role !== "admin" && user.role !== "super-admin") {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Access Denied: Insufficient permissions",
        });
        return;
      }

      // Attach user info to request for downstream use
      req.id = user._id;
      req.email = decoded.email;
      req.accountdetails = decoded;

      next();
    } catch (error: any) {
      console.error("JWT Verification Error:", error.message, error.stack);

      if (error.name === "TokenExpiredError") {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Session Expired. Please login again",
        });
      } else if (error.name === "JsonWebTokenError") {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Invalid Token. Please login again",
        });
      } else {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Internal Server Error",
        });
      }
    }
  } catch (err: any) {
    console.error("Authentication Error:", err.message, err.stack);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_RESPONSE.FAIL,
      message: err.message,
    });
  }
};
