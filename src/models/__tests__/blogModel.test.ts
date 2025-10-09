import mongoose from "mongoose";
import { BlogsModel, IBlogsModel } from "../blogsModel"; // adjust path as needed

describe("BlogsModel", () => {
  beforeAll(async () => {
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
    await BlogsModel.deleteMany({});
  });

  it("should create a blog with valid data", async () => {
    const blogData = {
      blogTitle: "Test Blog",
      blogCategory: "Tech",
      blogDescription: "This is a test blog",
      blogImg: "image.png",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    };

    const blog = await BlogsModel.create(blogData);

    expect(blog._id).toBeDefined();
    expect(blog.blogTitle).toBe(blogData.blogTitle);
    expect(blog.blogCategory).toBe(blogData.blogCategory);
    expect(blog.blogDescription).toBe(blogData.blogDescription);
    expect(blog.blogImg).toBe(blogData.blogImg);
    expect(blog.seoTitle).toBe(blogData.seoTitle);
    expect(blog.seoDescription).toBe(blogData.seoDescription);
    expect(blog.status).toBe("active"); // default
    expect(blog.isDeleted).toBe(false); // default
    expect(blog.length).toBe(0); // default coerced from false
  });

  it("should throw validation error if blogTitle is missing", async () => {
    const blogData = {
      blogCategory: "Tech",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    };
    await expect(BlogsModel.create(blogData as any)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should throw validation error if blogCategory is missing", async () => {
    const blogData = {
      blogTitle: "Missing Category",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    };
    await expect(BlogsModel.create(blogData as any)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should throw validation error if seoTitle is missing", async () => {
    const blogData = {
      blogTitle: "Missing SEO Title",
      blogCategory: "Tech",
      seoDescription: "SEO Description",
    };
    await expect(BlogsModel.create(blogData as any)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should throw validation error if seoDescription is missing", async () => {
    const blogData = {
      blogTitle: "Missing SEO Description",
      blogCategory: "Tech",
      seoTitle: "SEO Title",
    };
    await expect(BlogsModel.create(blogData as any)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should enforce enum for status", async () => {
    const blogData = {
      blogTitle: "Invalid Status Blog",
      blogCategory: "Tech",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
      status: "archived",
    };
    await expect(BlogsModel.create(blogData as any)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should allow setting optional fields", async () => {
    const blogData = {
      blogTitle: "Full Blog",
      blogCategory: "Lifestyle",
      blogDescription: "Optional fields included",
      blogImg: "optional.png",
      seoTitle: "Full SEO Title",
      seoDescription: "Full SEO Description",
      status: "inactive",
      isDeleted: true,
      length: 123,
    };

    const blog = await BlogsModel.create(blogData);

    expect(blog.status).toBe("inactive");
    expect(blog.isDeleted).toBe(true);
    expect(blog.length).toBe(123);
  });

  it("should have createdAt and updatedAt timestamps", async () => {
    const blogData = {
      blogTitle: "Timestamp Blog",
      blogCategory: "News",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    };

    const blog = await BlogsModel.create(blogData);

    expect(blog.createdAt).toBeInstanceOf(Date);
    expect(blog.updatedAt).toBeInstanceOf(Date);
  });
});