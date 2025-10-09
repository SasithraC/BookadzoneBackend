import mongoose from "mongoose";
import blogCategoryRepository from "../blogCategoryRepository";
import { ENV } from "../../config/env";

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("BlogCategoryRepository", () => {
  let categoryId: string;

  it("creates BlogCategory", async () => {
    const category = await blogCategoryRepository.createBlogCategory({
      name: "RepoTech",
      status: "active",
      isDeleted: false
    } as any);

    expect(category.name).toBe("RepoTech");
    expect(category.status).toBe("active");
    // @ts-ignore
    categoryId = category.id?.toString();
  });

  it("gets BlogCategory by ID", async () => {
    const found = await blogCategoryRepository.getBlogCategoryById(categoryId);
    expect(found && found.id?.toString()).toBe(categoryId);
  });

  it("updates BlogCategory", async () => {
    const updated = await blogCategoryRepository.updateBlogCategory(categoryId, {
      name: "Updated RepoTech"
    });
    expect(updated?.name).toBe("Updated RepoTech");
  });

  it("soft deletes BlogCategory", async () => {
    const deleted = await blogCategoryRepository.softDeleteBlogCategory(categoryId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it("restores BlogCategory", async () => {
    const restored = await blogCategoryRepository.restoreBlogCategory(categoryId);
    expect(restored?.isDeleted).toBe(false);
    expect(restored?.status).toBe("active");
  });

  it("gets all active BlogCategories", async () => {
  // First, create a few categories to test
  const cat1 = await blogCategoryRepository.createBlogCategory({
    name: "Tech",
    status: "active",
    isDeleted: false
  } as any);

  const cat2 = await blogCategoryRepository.createBlogCategory({
    name: "Health",
    status: "inactive", // should not appear
    isDeleted: false
  } as any);

  const cat3 = await blogCategoryRepository.createBlogCategory({
    name: "Lifestyle",
    status: "active",
    isDeleted: true // should not appear
  } as any);

  const categories = await blogCategoryRepository.getAllBlog();

  // Should only return categories that are active and not deleted
  expect(categories).toBeInstanceOf(Array);
  expect(categories?.length).toBeGreaterThan(0);

  // All returned categories must have status "active" and isDeleted false
  categories?.forEach(cat => {
    expect(cat.status).toBe("active");
    expect(cat.isDeleted).toBe(false);

    // Only these two fields should exist
    expect(Object.keys(cat.toObject ? cat.toObject() : cat)).toEqual(
      expect.arrayContaining(["status", "isDeleted"])
    );
  });
});

  
});
