import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS_CODE, HTTP_RESPONSE } from "../utils/httpResponse";

interface DecodedToken extends JwtPayload {
  _id: string;
  id: string;
  email: string;
  role: "super-admin" | "admin" | "user";
}

// No need for excluded paths as we'll explicitly add auth middleware where needed
const excludedPaths: string[] = [];

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
      // Debug: Log request info
      console.log('Request path:', req.path);
      console.log('Incoming headers:', req.headers);
      console.log('Authorization header:', req.headers.authorization);
      
    // PATH exclusion check
    const apiPath = req.path.replace("/api/v1/", "");
    console.log('API Path:', apiPath); // Debug log
    
    if (excludedPaths.includes(apiPath)) {
      console.log('Path excluded from auth:', apiPath); // Debug log
      return next();
    }

    // Authorization Header Check
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log('Missing or invalid bearer token:', authHeader); // Debug log
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

      console.log('Decoded token:', decoded); // Debug log

      const userId = decoded._id || decoded.id;
      console.log('User ID from token:', userId); // Debug log

      let user;
      try {
        user = await User.findOne({ _id: userId }).select("_id role status isDeleted email");
        console.log('Found user:', user); // Debug log
      } catch (dbErr: any) {
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
        console.log('No user found for ID:', userId); // Debug log
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

      // Attach user info to request object
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      };

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
