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
      // Debug: Log all incoming headers
      console.log('Incoming headers:', req.headers);
    // PATH exclusion check
    const apiPath = req.path.replace("/api/v1/", "");
    if (excludedPaths.includes(apiPath)) {
      return next();
    }

    // Authorization Header Check
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Bearer token missing",
      });
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Bearer token missing",
      });
      return;
    }

    // Dynamic User model requiring
    const User = require("../models/userModel").default;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      if (!decoded) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Invalid or expired token",
        });
        return;
      }

      const userId = decoded._id || decoded.id;
      let user;
      try {
        user = await User.findOne({ _id: userId }).select("role status isDeleted");
      } catch (dbErr: any) {
        // Database connection/query error
        console.error("Authentication Error:", dbErr.message, dbErr.stack);
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          status: HTTP_RESPONSE.FAIL,
          message: dbErr.message && dbErr.message.includes("connection")
            ? "Database connection failed"
            : "Database query failed",
        });
        return;
      }
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

      if (user.role !== "admin" && user.role !== "super-admin") {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User does not have sufficient permissions",
        });
        return;
      }

      // Attach info to request object
      req.id = user._id;
      req.email = decoded.email;
      req.accountdetails = decoded;

      next();
    } catch (error: any) {
      // Only JWT errors here
      console.error("JWT Verification Error:", error.message, error.stack);
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Invalid or expired token",
      });
    }
  } catch (err: any) {
    console.error("Authentication Error:", err.message, err.stack);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_RESPONSE.FAIL,
      message: err.message,
    });
  }
};
