"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/authenticationService.ts
const authenticationRepository_1 = __importDefault(require("../repositories/authenticationRepository"));
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
class AuthenticationService {
    validateLoginData(data) {
        const rules = [
            validationHelper_1.default.isRequired(data.email, "email"),
            validationHelper_1.default.isValidEmail(data.email, "email"),
            validationHelper_1.default.isRequired(data.password, "password"),
            validationHelper_1.default.minLength(data.password, "password", 6),
            validationHelper_1.default.maxLength(data.password, "password", 100),
        ];
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            throw new Error(errors.map((e) => e.message).join(", "));
        }
    }
    async authLogin(data) {
        this.validateLoginData(data);
        return await authenticationRepository_1.default.authLogin(data);
    }
    async refreshToken(token) {
        return await authenticationRepository_1.default.refreshToken(token);
    }
}
exports.default = new AuthenticationService();
