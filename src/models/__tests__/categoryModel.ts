import mongoose from "mongoose";
import { CategoryModel } from "../catrgoryModel"
import { ENV } from "../../config/env";

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("CategoryModel", () => {

  it("requires name, slug, description, and photo", async () => {
    const category = new CategoryModel({});
    let error;
    try {
      await category.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    if (error && typeof error === "object" && "errors" in error) {
      const err = error as { errors: { [key: string]: any } };
      expect(err.errors.name).toBeDefined();
      expect(err.errors.slug).toBeDefined();
      expect(err.errors.description).toBeDefined();
      expect(err.errors.photo).toBeDefined();
    }
  });

  it("defaults status to 'active' and checkbox to true", async () => {
    const category = await CategoryModel.create({
      name: "Test Category",
      slug: "test-category",
      description: "This is a test category",
      photo: "test.jpg",
    });
    expect(category.status).toBe("active");
    expect(category.checkbox).toBe(true);
  });

  it("accepts custom status and checkbox", async () => {
    const category = await CategoryModel.create({
      name: "Inactive Category",
      slug: "inactive-category",
      description: "This category is inactive",
      photo: "inactive.jpg",
      status: "inactive",
      checkbox: false,
    });
    expect(category.status).toBe("inactive");
    expect(category.checkbox).toBe(false);
  });
});
