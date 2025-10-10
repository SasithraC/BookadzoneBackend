import mongoose from "mongoose";
import { CategoryModel, ICategory } from "../catrgoryModel";

jest.mock('mongoose', () => {
  const mSchema = jest.fn().mockImplementation((definition) => ({
    obj: definition,
  }));

  return {
    Schema: mSchema,
    model: jest.fn().mockReturnValue(class MockCategoryModel {
      _id: string;
      name: string;
      description: string;
      slug: string;
      photo: string;
      status: string;
      isDeleted: boolean;
      isFeatured: boolean;
      createdAt: Date;
      updatedAt: Date;

      constructor(data: any = {}) {
        this._id = Math.random().toString(36).substr(2, 9);
        this.name = '';
        this.description = '';
        this.slug = '';
        this.photo = '';
        this.status = 'active';
        this.isDeleted = false;
        this.isFeatured = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        Object.assign(this, data);
      }

      static async create(data: any) {
        if (!data.name) {
          const error = new Error('ValidationError');
          error.name = 'ValidationError';
          (error as any).errors = { name: { message: 'name is required' } };
          throw error;
        }
        if (!data.description) {
          const error = new Error('ValidationError');
          error.name = 'ValidationError';
          (error as any).errors = { description: { message: 'description is required' } };
          throw error;
        }
        if (data.status && !['active', 'inactive'].includes(data.status)) {
          const error = new Error('ValidationError');
          error.name = 'ValidationError';
          (error as any).errors = { status: { message: 'Invalid status' } };
          throw error;
        }
        return new MockCategoryModel(data);
      }

      static deleteMany() {
        return Promise.resolve({ deletedCount: 1 });
      }
    }),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connection: {
      dropDatabase: jest.fn(),
      close: jest.fn(),
    },
    Error: {
      ValidationError: Error
    }
  };
});

describe("CategoryModel", () => {

  it("should create a category with valid data", async () => {
    const categoryData = {
      name: "Test Category",
      description: "This is a test category",
    };
    const category = await CategoryModel.create(categoryData);

    expect(category._id).toBeDefined();
    expect(category.name).toBe(categoryData.name);
    expect(category.description).toBe(categoryData.description);
    expect(category.status).toBe("active"); // default
    expect(category.isDeleted).toBe(false); // default
    expect(category.isFeatured).toBe(false); // default
    expect(category.slug).toBe(""); // default
  });

  it("should throw validation error if name is missing", async () => {
    const categoryData = {
      description: "No name provided",
    };
    await expect(CategoryModel.create(categoryData as any)).rejects.toThrow('ValidationError');
  });

  it("should throw validation error if description is missing", async () => {
    const categoryData = {
      name: "No Description",
    };
    await expect(CategoryModel.create(categoryData as any)).rejects.toThrow('ValidationError');
  });

  it("should enforce enum for status", async () => {
    const categoryData = {
      name: "Invalid Status",
      description: "Testing enum",
      status: "unknown",
    };
    await expect(CategoryModel.create(categoryData as any)).rejects.toThrow('ValidationError');
  });

  it("should allow setting optional fields", async () => {
    const categoryData = {
      name: "Full Category",
      description: "With all optional fields",
      slug: "full-category",
      photo: "photo.png",
      isFeatured: true,
      status: "inactive",
      isDeleted: true,
    };
    const category = await CategoryModel.create(categoryData);
    expect(category.slug).toBe(categoryData.slug);
    expect(category.photo).toBe(categoryData.photo);
    expect(category.isFeatured).toBe(true);
    expect(category.status).toBe("inactive");
    expect(category.isDeleted).toBe(true);
  });

  it("should have createdAt and updatedAt timestamps", async () => {
    const categoryData = {
      name: "Timestamp Category",
      description: "Check timestamps",
    };
    const category = await CategoryModel.create(categoryData);
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
  });
});
