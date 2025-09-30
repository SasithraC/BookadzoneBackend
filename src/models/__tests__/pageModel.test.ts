import mongoose from "mongoose";
import { PageModel } from "../pageModel";
import { ENV } from "../../config/env";

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI);
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("PageModel", () => {
  it("requires title, name, slug, and type", async () => {
    const page = new PageModel({});
    let error;
    try {
      await page.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    if (error && typeof error === "object" && "errors" in error) {
      const err = error as { errors: { [key: string]: any } };
      expect(err.errors.title).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.slug).toBeDefined();
      expect(err.errors.type).toBeDefined();
    }
  });

  it("defaults status and isDeleted", async () => {
    const page = await PageModel.create({
      title: "Test Title",
      name: "Test Name",
      slug: "test-slug",
      type: "template",
    });
    expect(page.status).toBe("active");
    expect(page.isDeleted).toBe(false);
    await PageModel.deleteOne({ _id: page._id });
  });

  it("should not allow duplicate slugs", async () => {
    const slug = "unique-slug";
    await PageModel.create({
      title: "Title1",
      name: "Name1",
      slug,
      type: "template",
    });
    let error;
    try {
      await PageModel.create({
        title: "Title2",
        name: "Name2",
        slug,
        type: "template",
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    await PageModel.deleteMany({ slug });
  });
});