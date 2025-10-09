import mongoose from "mongoose";
import { CategoryModel, ICategory } from "../categoryModel";

describe("CategoryModel", () => {
  beforeAll(async () => {
    // Connect to in-memory MongoDB for testing
    await mongoose.connect((globalThis as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await CategoryModel.deleteMany({});
  });

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
    await expect(CategoryModel.create(categoryData as any)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should throw validation error if description is missing", async () => {
    const categoryData = {
      name: "No Description",
    };
    await expect(CategoryModel.create(categoryData as any)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should enforce enum for status", async () => {
    const categoryData = {
      name: "Invalid Status",
      description: "Testing enum",
      status: "unknown",
    };
    await expect(CategoryModel.create(categoryData as any)).rejects.toThrow(mongoose.Error.ValidationError);
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
