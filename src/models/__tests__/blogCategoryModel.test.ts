import mongoose from "mongoose";
import { BlogCategoryModel } from "../blogCategoryModel";
import { ENV } from "../../config/env";

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("BlogCategoryModel", () => {
  it("requires name field", async () => {
    const category = new BlogCategoryModel({});
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
    }
  });

  it("defaults status and isDeleted", async () => {
    const category = await BlogCategoryModel.create({ name: "Tech" });
    expect(category.status).toBe("active");
    expect(category.isDeleted).toBe(false);
  });

  it("accepts valid status values", async () => {
    const activeCategory = await BlogCategoryModel.create({ name: "Science", status: "active" });
    const inactiveCategory = await BlogCategoryModel.create({ name: "History", status: "inactive" });

    expect(activeCategory.status).toBe("active");
    expect(inactiveCategory.status).toBe("inactive");
  });
});
