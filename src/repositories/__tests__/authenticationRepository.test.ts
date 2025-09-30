import authenticationRepository from "../authenticationRepository";
import User from "../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../models/userModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockUser = {
  _id: "64f5a1b2c3d4e5f6a7b8c9d0",
  email: "test@example.com",
  password: "hashedpassword123",
  role: "admin",
  status: "active",
};

describe("AuthenticationRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret-key";
    process.env.JWT_EXPIRE_TIME = "1d";
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRE_TIME;
  });

  describe("authLogin", () => {
    const loginData = {
      email: "test@example.com",
      password: "password123"
    };

    beforeEach(() => {
      const mockUserQuery = {
        select: jest.fn().mockReturnValue({
          lean: jest.fn()
        })
      };
      (User.findOne as jest.Mock).mockReturnValue(mockUserQuery);
    });

    it("should successfully authenticate user with correct credentials", async () => {
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("generated-jwt-token");

      const result = await authenticationRepository.authLogin(loginData);

      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(mockUserQuery.select).toHaveBeenCalledWith("_id email password role status");
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: mockUser._id,
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
        "test-secret-key",
        { expiresIn: "1d" }
      );

      expect(result).toEqual({
        token: "generated-jwt-token",
        data: {
          _id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role,
          status: mockUser.status
        },
        expiresIn: "1d"
      });
    });

    it("should throw error if user does not exist", async () => {
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue(null);

      await expect(authenticationRepository.authLogin(loginData))
        .rejects.toThrow("Email does not exist");

      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("should throw error if password does not match", async () => {
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authenticationRepository.authLogin(loginData))
        .rejects.toThrow("Invalid password for user");

      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should exclude password from returned data", async () => {
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const result = await authenticationRepository.authLogin(loginData);

      expect(result.data).not.toHaveProperty('password');
      expect(result.data).toEqual({
        _id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
        status: mockUser.status
      });
    });

    it("should use custom expire time when valid", async () => {
      process.env.JWT_EXPIRE_TIME = "2h";
      
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const result = await authenticationRepository.authLogin(loginData);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        "test-secret-key",
        { expiresIn: "2h" }
      );
      expect(result.expiresIn).toBe("2h");
    });

    it("should default to 1d when expire time is invalid", async () => {
      process.env.JWT_EXPIRE_TIME = "invalid-time";
      
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const result = await authenticationRepository.authLogin(loginData);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        "test-secret-key",
        { expiresIn: "1d" }
      );
      expect(result.expiresIn).toBe("1d");
    });
  });

  describe("refreshToken", () => {
    const validToken = "valid-jwt-token";
    const decodedToken = {
      _id: "64f5a1b2c3d4e5f6a7b8c9d0",
      id: "64f5a1b2c3d4e5f6a7b8c9d0",
      email: "test@example.com",
      role: "admin"
    };

    beforeEach(() => {
      const mockUserQuery = {
        select: jest.fn().mockReturnValue({
          lean: jest.fn()
        })
      };
      (User.findOne as jest.Mock).mockReturnValue(mockUserQuery);
    });

    it("should throw error if JWT_SECRET is not defined", async () => {
      delete process.env.JWT_SECRET;

      await expect(authenticationRepository.refreshToken(validToken))
        .rejects.toThrow("JWT_SECRET not defined in environment");
    });

    it("should throw error if token verification fails", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(authenticationRepository.refreshToken(validToken))
        .rejects.toThrow("Invalid or expired token");

      expect(jwt.verify).toHaveBeenCalledWith(validToken, "test-secret-key");
    });

    it("should throw error if user not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue(null);

      await expect(authenticationRepository.refreshToken(validToken))
        .rejects.toThrow("User not found");

      expect(User.findOne).toHaveBeenCalledWith({ _id: decodedToken._id });
    });

    it("should successfully refresh token with _id", async () => {
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (jwt.sign as jest.Mock).mockReturnValue("new-jwt-token");
      
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue({
        _id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
        status: mockUser.status
      });

      const result = await authenticationRepository.refreshToken(validToken);

      expect(jwt.verify).toHaveBeenCalledWith(validToken, "test-secret-key");
      expect(User.findOne).toHaveBeenCalledWith({ _id: decodedToken._id });
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: mockUser._id,
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
        "test-secret-key",
        { expiresIn: "1d" }
      );

      expect(result).toEqual({
        token: "new-jwt-token",
        data: {
          _id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role,
          status: mockUser.status
        },
        expiresIn: "1d"
      });
    });

    it("should successfully refresh token with id property", async () => {
      const tokenWithId = { ...decodedToken, _id: undefined, id: "64f5a1b2c3d4e5f6a7b8c9d0" };
      (jwt.verify as jest.Mock).mockReturnValue(tokenWithId);
      (jwt.sign as jest.Mock).mockReturnValue("new-jwt-token");
      
      const mockUserQuery = (User.findOne as jest.Mock)();
      mockUserQuery.select().lean.mockResolvedValue({
        _id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
        status: mockUser.status
      });

      const result = await authenticationRepository.refreshToken(validToken);

      expect(User.findOne).toHaveBeenCalledWith({ _id: tokenWithId.id });
      expect(result.token).toBe("new-jwt-token");
    });

    it("should handle JWT verification with expired token", async () => {
      const expiredError = new Error("jwt expired");
      (expiredError as any).name = "TokenExpiredError";
      (jwt.verify as jest.Mock).mockImplementation(() => { throw expiredError; });

      await expect(authenticationRepository.refreshToken(validToken))
        .rejects.toThrow("Invalid or expired token");
    });

    it("should handle JWT verification with malformed token", async () => {
      const malformedError = new Error("jwt malformed");
      (malformedError as any).name = "JsonWebTokenError";
      (jwt.verify as jest.Mock).mockImplementation(() => { throw malformedError; });

      await expect(authenticationRepository.refreshToken(validToken))
        .rejects.toThrow("Invalid or expired token");
    });
  });

  describe("_generateToken (private method testing through public methods)", () => {
    const loginData = {
      email: "test@example.com",
      password: "password123"
    };

    beforeEach(() => {
      const mockUserQuery = {
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockUser)
        })
      };
      (User.findOne as jest.Mock).mockReturnValue(mockUserQuery);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    });

    it("should use default expire time when JWT_EXPIRE_TIME is not set", async () => {
      delete process.env.JWT_EXPIRE_TIME;
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const result = await authenticationRepository.authLogin(loginData);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        "test-secret-key",
        { expiresIn: "1d" }
      );
      expect(result.expiresIn).toBe("1d");
    });

    it("should use valid expire times from environment", async () => {
      const validTimes = ["1d", "2d", "1h", "2h", "30m", "1m"];
      
      for (const time of validTimes) {
        process.env.JWT_EXPIRE_TIME = time;
        (jwt.sign as jest.Mock).mockReturnValue("token");

        const result = await authenticationRepository.authLogin(loginData);

        expect(jwt.sign).toHaveBeenCalledWith(
          expect.any(Object),
          "test-secret-key",
          { expiresIn: time }
        );
        expect(result.expiresIn).toBe(time);
        
        jest.clearAllMocks();
        const mockUserQuery = {
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockUser)
          })
        };
        (User.findOne as jest.Mock).mockReturnValue(mockUserQuery);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      }
    });

    it("should include both _id and id in JWT payload", async () => {
      (jwt.sign as jest.Mock).mockReturnValue("token");

      await authenticationRepository.authLogin(loginData);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: mockUser._id,
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
        "test-secret-key",
        { expiresIn: "1d" }
      );
    });
  });
});