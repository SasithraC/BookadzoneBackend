import authenticationService from "../authenticationService";
import authenticationRepository from "../../repositories/authenticationRepository";
import ValidationHelper from "../../utils/validationHelper";

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
      (ValidationHelper.validate as jest.Mock).mockReturnValue([]);
    });

    it("should validate login data and call repository on success", async () => {
      (authenticationRepository.authLogin as jest.Mock).mockResolvedValue(mockAuthResponse);

      const result = await authenticationService.authLogin(validLoginData);

      expect(ValidationHelper.validate).toHaveBeenCalledWith([
        undefined, // mocked validation rules
        undefined,
        undefined,
        undefined,
        undefined
      ]);
      expect(authenticationRepository.authLogin).toHaveBeenCalledWith(validLoginData);
      expect(result).toBe(mockAuthResponse);
    });

    it("should throw validation error for empty email", async () => {
      const invalidData = { ...validLoginData, email: "" };
      const validationErrors = [{ field: "email", message: "email is required" }];
      (ValidationHelper.validate as jest.Mock).mockReturnValue(validationErrors);

      await expect(authenticationService.authLogin(invalidData))
        .rejects.toThrow("email is required");
      
      expect(authenticationRepository.authLogin).not.toHaveBeenCalled();
    });

    it("should throw validation error for invalid email format", async () => {
      const invalidData = { ...validLoginData, email: "invalid-email" };
      const validationErrors = [{ field: "email", message: "email must be a valid email address" }];
      (ValidationHelper.validate as jest.Mock).mockReturnValue(validationErrors);

      await expect(authenticationService.authLogin(invalidData))
        .rejects.toThrow("email must be a valid email address");
      
      expect(authenticationRepository.authLogin).not.toHaveBeenCalled();
    });

    it("should throw validation error for empty password", async () => {
      const invalidData = { ...validLoginData, password: "" };
      const validationErrors = [{ field: "password", message: "password is required" }];
      (ValidationHelper.validate as jest.Mock).mockReturnValue(validationErrors);

      await expect(authenticationService.authLogin(invalidData))
        .rejects.toThrow("password is required");
      
      expect(authenticationRepository.authLogin).not.toHaveBeenCalled();
    });

    it("should throw validation error for short password", async () => {
      const invalidData = { ...validLoginData, password: "123" };
      const validationErrors = [{ field: "password", message: "password must be at least 6 characters long" }];
      (ValidationHelper.validate as jest.Mock).mockReturnValue(validationErrors);

      await expect(authenticationService.authLogin(invalidData))
        .rejects.toThrow("password must be at least 6 characters long");
      
      expect(authenticationRepository.authLogin).not.toHaveBeenCalled();
    });

    it("should throw validation error for long password", async () => {
      const invalidData = { ...validLoginData, password: "a".repeat(101) };
      const validationErrors = [{ field: "password", message: "password must not exceed 100 characters" }];
      (ValidationHelper.validate as jest.Mock).mockReturnValue(validationErrors);

      await expect(authenticationService.authLogin(invalidData))
        .rejects.toThrow("password must not exceed 100 characters");
      
      expect(authenticationRepository.authLogin).not.toHaveBeenCalled();
    });

    it("should combine multiple validation errors", async () => {
      const invalidData = { email: "", password: "123" };
      const validationErrors = [
        { field: "email", message: "email is required" },
        { field: "password", message: "password must be at least 6 characters long" }
      ];
      (ValidationHelper.validate as jest.Mock).mockReturnValue(validationErrors);

      await expect(authenticationService.authLogin(invalidData))
        .rejects.toThrow("email is required, password must be at least 6 characters long");
      
      expect(authenticationRepository.authLogin).not.toHaveBeenCalled();
    });

    it("should propagate repository errors", async () => {
      const repositoryError = new Error("User not found");
      (authenticationRepository.authLogin as jest.Mock).mockRejectedValue(repositoryError);

      await expect(authenticationService.authLogin(validLoginData))
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
      (ValidationHelper.isRequired as jest.Mock) = jest.fn().mockReturnValue(mockValidationRules[0]);
      (ValidationHelper.isValidEmail as jest.Mock) = jest.fn().mockReturnValue(mockValidationRules[1]);
      (ValidationHelper.minLength as jest.Mock) = jest.fn().mockReturnValue(mockValidationRules[3]);
      (ValidationHelper.maxLength as jest.Mock) = jest.fn().mockReturnValue(mockValidationRules[4]);

      (authenticationRepository.authLogin as jest.Mock).mockResolvedValue(mockAuthResponse);

      await authenticationService.authLogin(validLoginData);

      expect(ValidationHelper.validate).toHaveBeenCalled();
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
      (authenticationRepository.refreshToken as jest.Mock).mockResolvedValue(mockRefreshResponse);

      const result = await authenticationService.refreshToken(validToken);

      expect(authenticationRepository.refreshToken).toHaveBeenCalledWith(validToken);
      expect(result).toBe(mockRefreshResponse);
    });

    it("should propagate repository errors", async () => {
      const repositoryError = new Error("Invalid token");
      (authenticationRepository.refreshToken as jest.Mock).mockRejectedValue(repositoryError);

      await expect(authenticationService.refreshToken(validToken))
        .rejects.toThrow("Invalid token");
    });

    it("should handle expired token error", async () => {
      const expiredTokenError = new Error("Token expired");
      (authenticationRepository.refreshToken as jest.Mock).mockRejectedValue(expiredTokenError);

      await expect(authenticationService.refreshToken(validToken))
        .rejects.toThrow("Token expired");
    });

    it("should handle malformed token error", async () => {
      const malformedTokenError = new Error("Malformed token");
      (authenticationRepository.refreshToken as jest.Mock).mockRejectedValue(malformedTokenError);

      await expect(authenticationService.refreshToken(validToken))
        .rejects.toThrow("Malformed token");
    });
  });
});