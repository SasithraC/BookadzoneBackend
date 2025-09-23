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
            const authData = await authenticationService_1.default.authLogin(req.body);
            res.status(200).json({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Logged in successfully",
                ...authData,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "No Bearer Token" });
                return;
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                res.status(httpResponse_1.HTTP_STATUS_CODE.FORBIDDEN).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Token not found" });
                return;
            }
            const authData = await authenticationService_1.default.refreshToken(token);
            res.status(200).json({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Token refreshed successfully",
                ...authData,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = new AuthenticationController();
