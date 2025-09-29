"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authenticationService_1 = __importDefault(require("../authenticationService"));
const authenticationRepository_1 = __importDefault(require("../../repositories/authenticationRepository"));
const validationHelper_1 = __importDefault(require("../../utils/validationHelper"));
jest.mock("../../repositories/authenticationRepository");
jest.mock("../../utils/validationHelper");
describe("AuthenticationService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("authLogin", () => {
        const validLoginData = {
            email: "test@example.com",
            password: "password123"
        };
        const mockAuthResponse = {
            token: "jwt-token",
            data: { id: "123", email: "test@example.com" },
            expiresIn: "1d"
        };
        beforeEach(() => {
            // Mock successful validation by default
            validationHelper_1.default.validate.mockReturnValue([]);
        });
        it("should validate login data and call repository on success", async () => {
            authenticationRepository_1.default.authLogin.mockResolvedValue(mockAuthResponse);
            const result = await authenticationService_1.default.authLogin(validLoginData);
            expect(validationHelper_1.default.validate).toHaveBeenCalledWith([
                undefined, // mocked validation rules
                undefined,
                undefined,
                undefined,
                undefined
            ]);
            expect(authenticationRepository_1.default.authLogin).toHaveBeenCalledWith(validLoginData);
            expect(result).toBe(mockAuthResponse);
        });
        it("should throw validation error for empty email", async () => {
            const invalidData = { ...validLoginData, email: "" };
            const validationErrors = [{ field: "email", message: "email is required" }];
            validationHelper_1.default.validate.mockReturnValue(validationErrors);
            await expect(authenticationService_1.default.authLogin(invalidData))
                .rejects.toThrow("email is required");
            expect(authenticationRepository_1.default.authLogin).not.toHaveBeenCalled();
        });
        it("should throw validation error for invalid email format", async () => {
            const invalidData = { ...validLoginData, email: "invalid-email" };
            const validationErrors = [{ field: "email", message: "email must be a valid email address" }];
            validationHelper_1.default.validate.mockReturnValue(validationErrors);
            await expect(authenticationService_1.default.authLogin(invalidData))
                .rejects.toThrow("email must be a valid email address");
            expect(authenticationRepository_1.default.authLogin).not.toHaveBeenCalled();
        });
        it("should throw validation error for empty password", async () => {
            const invalidData = { ...validLoginData, password: "" };
            const validationErrors = [{ field: "password", message: "password is required" }];
            validationHelper_1.default.validate.mockReturnValue(validationErrors);
            await expect(authenticationService_1.default.authLogin(invalidData))
                .rejects.toThrow("password is required");
            expect(authenticationRepository_1.default.authLogin).not.toHaveBeenCalled();
        });
        it("should throw validation error for short password", async () => {
            const invalidData = { ...validLoginData, password: "123" };
            const validationErrors = [{ field: "password", message: "password must be at least 6 characters long" }];
            validationHelper_1.default.validate.mockReturnValue(validationErrors);
            await expect(authenticationService_1.default.authLogin(invalidData))
                .rejects.toThrow("password must be at least 6 characters long");
            expect(authenticationRepository_1.default.authLogin).not.toHaveBeenCalled();
        });
        it("should throw validation error for long password", async () => {
            const invalidData = { ...validLoginData, password: "a".repeat(101) };
            const validationErrors = [{ field: "password", message: "password must not exceed 100 characters" }];
            validationHelper_1.default.validate.mockReturnValue(validationErrors);
            await expect(authenticationService_1.default.authLogin(invalidData))
                .rejects.toThrow("password must not exceed 100 characters");
            expect(authenticationRepository_1.default.authLogin).not.toHaveBeenCalled();
        });
        it("should combine multiple validation errors", async () => {
            const invalidData = { email: "", password: "123" };
            const validationErrors = [
                { field: "email", message: "email is required" },
                { field: "password", message: "password must be at least 6 characters long" }
            ];
            validationHelper_1.default.validate.mockReturnValue(validationErrors);
            await expect(authenticationService_1.default.authLogin(invalidData))
                .rejects.toThrow("email is required, password must be at least 6 characters long");
            expect(authenticationRepository_1.default.authLogin).not.toHaveBeenCalled();
        });
        it("should propagate repository errors", async () => {
            const repositoryError = new Error("User not found");
            authenticationRepository_1.default.authLogin.mockRejectedValue(repositoryError);
            await expect(authenticationService_1.default.authLogin(validLoginData))
                .rejects.toThrow("User not found");
        });
        it("should call ValidationHelper with correct rules", async () => {
            const mockValidationRules = [
                { field: "email", message: "" },
                { field: "email", message: "" },
                { field: "password", message: "" },
                { field: "password", message: "" },
                { field: "password", message: "" }
            ];
            // Mock the ValidationHelper methods
            validationHelper_1.default.isRequired = jest.fn().mockReturnValue(mockValidationRules[0]);
            validationHelper_1.default.isValidEmail = jest.fn().mockReturnValue(mockValidationRules[1]);
            validationHelper_1.default.minLength = jest.fn().mockReturnValue(mockValidationRules[3]);
            validationHelper_1.default.maxLength = jest.fn().mockReturnValue(mockValidationRules[4]);
            authenticationRepository_1.default.authLogin.mockResolvedValue(mockAuthResponse);
            await authenticationService_1.default.authLogin(validLoginData);
            expect(validationHelper_1.default.validate).toHaveBeenCalled();
        });
    });
    describe("refreshToken", () => {
        const validToken = "valid-jwt-token";
        const mockRefreshResponse = {
            token: "new-jwt-token",
            data: { id: "123", email: "test@example.com" },
            expiresIn: "1d"
        };
        it("should call repository refreshToken method", async () => {
            authenticationRepository_1.default.refreshToken.mockResolvedValue(mockRefreshResponse);
            const result = await authenticationService_1.default.refreshToken(validToken);
            expect(authenticationRepository_1.default.refreshToken).toHaveBeenCalledWith(validToken);
            expect(result).toBe(mockRefreshResponse);
        });
        it("should propagate repository errors", async () => {
            const repositoryError = new Error("Invalid token");
            authenticationRepository_1.default.refreshToken.mockRejectedValue(repositoryError);
            await expect(authenticationService_1.default.refreshToken(validToken))
                .rejects.toThrow("Invalid token");
        });
        it("should handle expired token error", async () => {
            const expiredTokenError = new Error("Token expired");
            authenticationRepository_1.default.refreshToken.mockRejectedValue(expiredTokenError);
            await expect(authenticationService_1.default.refreshToken(validToken))
                .rejects.toThrow("Token expired");
        });
        it("should handle malformed token error", async () => {
            const malformedTokenError = new Error("Malformed token");
            authenticationRepository_1.default.refreshToken.mockRejectedValue(malformedTokenError);
            await expect(authenticationService_1.default.refreshToken(validToken))
                .rejects.toThrow("Malformed token");
        });
    });
});
