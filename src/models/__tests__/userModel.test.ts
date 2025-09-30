import mongoose from "mongoose";
import User, { IUser } from "../userModel";
import { ENV } from "../../config/env";

describe("User Model", () => {
  beforeAll(async () => {
    await mongoose.connect(ENV.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("Schema Validation", () => {
    it("should require email and password fields", async () => {
      const user = new User({});
      let validationError: any;

      try {
        await user.save();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeDefined();
      expect(validationError.name).toBe("ValidationError");
      
      if (validationError && validationError.errors) {
        expect(validationError.errors.email).toBeDefined();
        expect(validationError.errors.password).toBeDefined();
        expect(validationError.errors.email.message).toMatch(/required/i);
        expect(validationError.errors.password.message).toMatch(/required/i);
      }
    });

    it("should validate email field is required", async () => {
      const user = new User({ password: "password123" });
      let validationError: any;

      try {
        await user.save();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeDefined();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.email.message).toMatch(/required/i);
    });

    it("should validate password field is required", async () => {
      const user = new User({ email: "test@example.com" });
      let validationError: any;

      try {
        await user.save();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeDefined();
      expect(validationError.errors.password).toBeDefined();
      expect(validationError.errors.password.message).toMatch(/required/i);
    });

    it("should validate role enum values", async () => {
      const user = new User({
        email: "test@example.com",
        password: "password123",
        role: "invalid-role" as any
      });
      let validationError: any;

      try {
        await user.save();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeDefined();
      expect(validationError.errors.role).toBeDefined();
      expect(validationError.errors.role.message).toMatch(/is not a valid enum value/i);
    });

    it("should validate status enum values", async () => {
      const user = new User({
        email: "test@example.com",
        password: "password123",
        status: "invalid-status" as any
      });
      let validationError: any;

      try {
        await user.save();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeDefined();
      expect(validationError.errors.status).toBeDefined();
      expect(validationError.errors.status.message).toMatch(/is not a valid enum value/i);
    });
  });

  describe("Default Values", () => {
    it("should set default values for role, status, and isDeleted", async () => {
      const user = await User.create({
        email: "test@example.com",
        password: "password123"
      });

      expect(user.role).toBe("super-admin");
      expect(user.status).toBe("active");
      expect(user.isDeleted).toBe(false);
    });

    it("should allow overriding default role", async () => {
      const user = await User.create({
        email: "admin@example.com",
        password: "password123",
        role: "admin"
      });

      expect(user.role).toBe("admin");
      expect(user.status).toBe("active");
      expect(user.isDeleted).toBe(false);
    });

    it("should allow overriding default status", async () => {
      const user = await User.create({
        email: "inactive@example.com",
        password: "password123",
        status: "inactive"
      });

      expect(user.role).toBe("super-admin");
      expect(user.status).toBe("inactive");
      expect(user.isDeleted).toBe(false);
    });

    it("should allow overriding default isDeleted", async () => {
      const user = await User.create({
        email: "deleted@example.com",
        password: "password123",
        isDeleted: true
      });

      expect(user.role).toBe("super-admin");
      expect(user.status).toBe("active");
      expect(user.isDeleted).toBe(true);
    });
  });

  describe("User Creation", () => {
    it("should create a valid super-admin user", async () => {
      const userData = {
        email: "superadmin@example.com",
        password: "securepassword123",
        role: "super-admin" as const
      };

      const user = await User.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.role).toBe("super-admin");
      expect(user.status).toBe("active");
      expect(user.isDeleted).toBe(false);
      expect(user._id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it("should create a valid admin user", async () => {
      const userData = {
        email: "admin@example.com",
        password: "securepassword123",
        role: "admin" as const
      };

      const user = await User.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.role).toBe("admin");
      expect(user.status).toBe("active");
      expect(user.isDeleted).toBe(false);
    });

    it("should create user with inactive status", async () => {
      const userData = {
        email: "inactive@example.com",
        password: "securepassword123",
        status: "inactive" as const
      };

      const user = await User.create(userData);

      expect(user.status).toBe("inactive");
      expect(user.role).toBe("super-admin"); // default
    });
  });

  describe("Timestamps", () => {
    it("should automatically add timestamps", async () => {
      const user = await User.create({
        email: "timestamped@example.com",
        password: "password123"
      });

      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt on modification", async () => {
      const user = await User.create({
        email: "update@example.com",
        password: "password123"
      });

      const originalUpdatedAt = user.updatedAt;
      
      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      user.status = "inactive";
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe("Model Reuse", () => {
    it("should reuse existing model if already compiled", async () => {
      // This test ensures the model reuse logic works
      const User1 = require("../userModel").default;
      const User2 = require("../userModel").default;

      expect(User1).toBe(User2);
    });

    it("should use users collection name", async () => {
      const user = await User.create({
        email: "collection@example.com",
        password: "password123"
      });

      expect(user.collection.name).toBe("users");
    });
  });

  describe("Interface Compliance", () => {
    it("should implement IUser interface correctly", async () => {
      const user = await User.create({
        email: "interface@example.com",
        password: "password123",
        role: "admin",
        status: "inactive",
        isDeleted: true
      });

      // Verify all IUser properties exist
      const userObject: IUser = user;
      expect(userObject.email).toBe("interface@example.com");
      expect(userObject.password).toBe("password123");
      expect(userObject.role).toBe("admin");
      expect(userObject.status).toBe("inactive");
      expect(userObject.isDeleted).toBe(true);
      
      // Verify Document properties
      expect(userObject._id).toBeDefined();
      expect(userObject.save).toBeDefined();
      expect(userObject.toJSON).toBeDefined();
    });
  });

  describe("Query Operations", () => {
    beforeEach(async () => {
      // Create test users
      await User.create([
        { email: "user1@example.com", password: "pass1", role: "admin", status: "active" },
        { email: "user2@example.com", password: "pass2", role: "super-admin", status: "inactive" },
        { email: "user3@example.com", password: "pass3", role: "admin", status: "active", isDeleted: true }
      ]);
    });

    it("should find users by email", async () => {
      const user = await User.findOne({ email: "user1@example.com" });
      expect(user).not.toBeNull();
      expect(user?.email).toBe("user1@example.com");
      expect(user?.role).toBe("admin");
    });

    it("should find users by role", async () => {
      const adminUsers = await User.find({ role: "admin" });
      expect(adminUsers).toHaveLength(2);
      expect(adminUsers.every(user => user.role === "admin")).toBe(true);
    });

    it("should find users by status", async () => {
      const activeUsers = await User.find({ status: "active" });
      expect(activeUsers).toHaveLength(2);
      expect(activeUsers.every(user => user.status === "active")).toBe(true);
    });

    it("should find non-deleted users", async () => {
      const nonDeletedUsers = await User.find({ isDeleted: { $ne: true } });
      expect(nonDeletedUsers).toHaveLength(2);
      expect(nonDeletedUsers.every(user => !user.isDeleted)).toBe(true);
    });

    it("should update user status", async () => {
      const user = await User.findOne({ email: "user1@example.com" });
      expect(user).not.toBeNull();
      
      if (user) {
        user.status = "inactive";
        await user.save();
        
        const updatedUser = await User.findOne({ email: "user1@example.com" });
        expect(updatedUser?.status).toBe("inactive");
      }
    });

    it("should soft delete user", async () => {
      const user = await User.findOne({ email: "user1@example.com" });
      expect(user).not.toBeNull();
      
      if (user) {
        user.isDeleted = true;
        await user.save();
        
        const deletedUser = await User.findOne({ email: "user1@example.com" });
        expect(deletedUser?.isDeleted).toBe(true);
      }
    });
  });
});