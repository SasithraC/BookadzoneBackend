"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpResponse_1 = require("../utils/httpResponse");
const excludedPaths = [
    "auth/login",
    "auth/register",
    "auth/forgotpassword",
    "auth/resetpassword",
];
const authenticate = async (req, res, next) => {
    try {
        // Allow excluded paths without authentication
        const apiPath = req.path.replace("/api/v1/", "");
        if (excludedPaths.includes(apiPath)) {
            return next();
        }
        // Check Authorization header
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                status: httpResponse_1.HTTP_RESPONSE.FAIL,
                message: "Access Denied: No Bearer Token",
            });
            return;
        }
        // Extract token
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                status: httpResponse_1.HTTP_RESPONSE.FAIL,
                message: "Token not found",
            });
            return;
        }
        // Load User model dynamically (to avoid circular dependencies)
        const User = require("../models/userModel").default;
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Invalid Token. Please contact an admin",
                });
                return;
            }
            // Get user ID from decoded token
            const userId = decoded._id || decoded.id;
            // Find user in DB
            const user = await User.findOne({ _id: userId }).select("role status isDeleted");
            if (!user) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Please contact an admin",
                });
                return;
            }
            // Check if user is deleted or inactive
            if (user.isDeleted) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Account deleted",
                });
                return;
            }
            if (user.status === "inactive") {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Account blocked. Please contact an admin",
                });
                return;
            }
            // Check user role authorization
            if (user.role !== "admin" && user.role !== "super-admin") {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Access Denied: Insufficient permissions",
                });
                return;
            }
            // Attach user info to request for downstream use
            req.id = user._id;
            req.email = decoded.email;
            req.accountdetails = decoded;
            next();
        }
        catch (error) {
            console.error("JWT Verification Error:", error.message, error.stack);
            if (error.name === "TokenExpiredError") {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Session Expired. Please login again",
                });
            }
            else if (error.name === "JsonWebTokenError") {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Invalid Token. Please login again",
                });
            }
            else {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Internal Server Error",
                });
            }
        }
    }
    catch (err) {
        console.error("Authentication Error:", err.message, err.stack);
        res.status(httpResponse_1.HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            status: httpResponse_1.HTTP_RESPONSE.FAIL,
            message: err.message,
        });
    }
};
exports.authenticate = authenticate;
