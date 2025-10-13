"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authenticationService_1 = __importDefault(require("../services/authenticationService"));
const httpResponse_1 = require("../utils/httpResponse");
class AuthenticationController {
    async authLogin(req, res, next) {
        try {
            console.log("🔍 AuthenticationController.authLogin: Starting with request body:", req.body);
            const { token, data, expiresIn, menus } = await authenticationService_1.default.authLogin(req.body);
            console.log("🔍 AuthenticationController.authLogin: Received from service:", {
                token,
                data,
                expiresIn,
                menus,
            });
            const response = {
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Logged in successfully",
                token,
                data,
                expiresIn,
                menus,
            };
            console.log("🔍 AuthenticationController.authLogin: Sending response:", response);
            res.status(200).json(response);
        }
        catch (err) {
            console.error("❌ AuthenticationController.authLogin: Error:", err.message);
            next(err);
        }
    }
    async refreshToken(req, res, next) {
        try {
            console.log("🔍 AuthenticationController.refreshToken: Starting with headers:", req.headers["authorization"]);
            const authHeader = req.headers["authorization"];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                console.error("❌ AuthenticationController.refreshToken: No Bearer Token");
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "No Bearer Token",
                });
                return;
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                console.error("❌ AuthenticationController.refreshToken: Token not found");
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({
                    status: httpResponse_1.HTTP_RESPONSE.FAIL,
                    message: "Token not found",
                });
                return;
            }
            console.log("🔍 AuthenticationController.refreshToken: Processing token:", token);
            const { token: newToken, data, expiresIn, menus } = await authenticationService_1.default.refreshToken(token);
            console.log("🔍 AuthenticationController.refreshToken: Received from service:", {
                token: newToken,
                data,
                expiresIn,
                menus,
            });
            const response = {
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Token refreshed successfully",
                token: newToken,
                data,
                expiresIn,
                menus,
            };
            console.log("🔍 AuthenticationController.refreshToken: Sending response:", response);
            res.status(200).json(response);
        }
        catch (err) {
            console.error("❌ AuthenticationController.refreshToken: Error:", err.message);
            next(err);
        }
    }
}
exports.default = new AuthenticationController();
