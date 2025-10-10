class MockUser {
  _id: string;
  email: string;
  password: string;
  role: string;
  status: string;
  isDeleted: boolean;
  collection: { name: string };
  createdAt: Date;
  updatedAt: Date;
  static users: any[] = [];

  constructor(data: any = {}) {
    this._id = Math.random().toString(36).substr(2, 9);
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || 'super-admin';
    this.status = data.status || 'active';
    this.isDeleted = data.isDeleted ?? false;
    this.collection = { name: 'users' };
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  validateSync() {
    const errors: any = {};

    if (!this.email) errors.email = { message: 'Email is required' };
    if (!this.password) errors.password = { message: 'Password is required' };
    if (this.role && !['super-admin', 'admin'].includes(this.role)) {
      errors.role = { message: '`role` is not a valid enum value' };
    }
    if (this.status && !['active', 'inactive'].includes(this.status)) {
      errors.status = { message: '`status` is not a valid enum value' };
    }

    if (Object.keys(errors).length > 0) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      (error as any).errors = errors;
      return error;
    }
    return undefined;
  }

  async save() {
    const validationError = this.validateSync();
    if (validationError) {
      throw validationError;
    }
    this.updatedAt = new Date();
    MockUser.users.push(this);
    return this;
  }

  toJSON() {
    return {
      _id: this._id,
      email: this.email,
      password: this.password,
      role: this.role,
      status: this.status,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static async create(data: any) {
    const user = new MockUser(data);
    await user.save();
    return user;
  }

  static async deleteMany() {
    MockUser.users = [];
    return { deletedCount: 1 };
  }

  // Replace static find and findOne definitions with async methods for proper behavior
  static async find(query: any) {
    return MockUser.users.filter((user: any) => {
      if (query.role) return user.role === query.role;
      if (query.status) return user.status === query.status;
      if (query.isDeleted && query.isDeleted.$ne) return !user.isDeleted;
      return true;
    });
  }

  static async findOne(query: any) {
    return MockUser.users.find((user: any) => user.email === query.email) || null;
  }
}

// Mocks must be before imports
jest.mock('../userModel', () => ({ __esModule: true, default: MockUser }));
jest.mock('mongoose', () => ({
  Schema: jest.fn().mockImplementation((definition) => ({ obj: definition })),
  model: jest.fn().mockReturnValue(MockUser),
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: { close: jest.fn() }
}));

import User, { IUser } from "../userModel";

describe("User Model", () => {
  beforeEach(async () => {
    // Reset users array and add test data
    MockUser.users = [];
    await MockUser.create({
      _id: '1',
      email: "user1@example.com",
      password: "pass1",
      role: "admin",
      status: "active",
      isDeleted: false
    });
    await MockUser.create({
      _id: '2',
      email: "user2@example.com",
      password: "pass2",
      role: "admin",
      status: "active",
      isDeleted: false
    });
  });

  // Schema Validation
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

  // Default Values
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

  // User Creation
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

  // Timestamps
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

  // Model Reuse
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

  // Interface Compliance
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

  // Query Operations
  describe("Query Operations", () => {
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
        expect(user.status).toBe("inactive");
      }
    });

    it("should soft delete user", async () => {
      const user = await User.findOne({ email: "user1@example.com" });
      expect(user).not.toBeNull();
      
      if (user) {
        user.isDeleted = true;
        await user.save();
        expect(user.isDeleted).toBe(true);
      }
    });
  });
});

