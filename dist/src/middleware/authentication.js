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
            res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                status: httpResponse_1.HTTP_RESPONSE.FAIL,
                message: "Bearer token missing",
            });
            return;
        }
        // Extract token
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                status: httpResponse_1.HTTP_RESPONSE.FAIL,
                message: "Bearer token missing",
            });
            return;
        }
        // Dynamic User model requiring
        const User = require("../models/userModel").default;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Invalid or expired token",
                });
                return;
            }
            const userId = decoded._id || decoded.id;
            let user;
            try {
                user = await User.findOne({ _id: userId }).select("role status isDeleted");
            }
            catch (dbErr) {
                // Database connection/query error
                console.error("Authentication Error:", dbErr.message, dbErr.stack);
                res.status(httpResponse_1.HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: dbErr.message && dbErr.message.includes("connection")
                        ? "Database connection failed"
                        : "Database query failed",
                });
                return;
            }
            if (!user) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "User not found. Contact admin.",
                });
                return;
            }
            if (user.isDeleted) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Account has been deleted",
                });
                return;
            }
            if (user.status === "inactive") {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Account is blocked",
                });
                return;
            }
            // if (user.role !== "admin" && user.role !== "super-admin") {
            //   res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            //     status: HTTP_RESPONSE.FAIL,
            //     message: "User does not have sufficient permissions",
            //   });
            //   return;
            // }
            // Attach info to request object
            req.id = user._id;
            req.email = decoded.email;
            req.accountdetails = decoded;
            next();
        }
        catch (error) {
            // Only JWT errors here
            console.error("JWT Verification Error:", error.message, error.stack);
            res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                status: httpResponse_1.HTTP_RESPONSE.FAIL,
                message: "Invalid or expired token",
            });
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
