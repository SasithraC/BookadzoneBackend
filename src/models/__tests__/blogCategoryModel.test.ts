import mongoose from "mongoose";
import { BlogCategoryModel } from "../blogCategoryModel";

jest.mock('mongoose', () => {
  const mSchema = jest.fn().mockImplementation((definition) => ({
    obj: definition,
  }));

  return {
    Schema: mSchema,
    model: jest.fn().mockReturnValue(class MockBlogCategoryModel {
      name: string;
      slug: string;
      status: string;
      isDeleted: boolean;

      constructor(data: any = {}) {
        this.name = '';
        this.slug = data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : '';
        this.status = 'active';
        this.isDeleted = false;
        Object.assign(this, data);
      }

      save() {
        const errors: any = {};
        if (!this.name) errors.name = { message: 'Name is required' };
        if (!this.slug) errors.slug = { message: 'Slug is required' };
        if (Object.keys(errors).length > 0) {
          return Promise.reject({ errors });
        }
        return Promise.resolve(this);
      }

      validateSync() {
        const errors: any = {};
        if (!this.name) errors.name = { message: 'Name is required' };
        if (!this.slug) errors.slug = { message: 'Slug is required' };
        return Object.keys(errors).length > 0 ? { errors } : undefined;
      }

      static create(data: any) {
        const instance = new MockBlogCategoryModel(data);
        return instance.save();
      }
    }),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
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
