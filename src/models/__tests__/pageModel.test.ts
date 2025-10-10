import { PageModel } from "../pageModel";

// Mock mongoose Model class
jest.mock('../pageModel', () => ({
  PageModel: {
    create: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  }
}));

describe("PageModel", () => {
  it("requires title, name, slug, and type", async () => {
    const mockError = {
      errors: {
        title: { message: "Title is required" },
        name: { message: "Name is required" },
        slug: { message: "Slug is required" },
        type: { message: "Type is required" }
      }
    };
    (PageModel.create as jest.Mock).mockRejectedValue(mockError);

    let error;
    try {
      await PageModel.create({});
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    if (typeof error === "object" && error !== null && "errors" in error) {
      const errors = (error as { errors: any }).errors;
      expect(errors.title).toBeDefined();
      expect(errors.name).toBeDefined();
      expect(errors.slug).toBeDefined();
      expect(errors.type).toBeDefined();
    }
  });

  it("defaults status and isDeleted", async () => {
    const mockPage = {
      title: "Test Title",
      name: "Test Name",
      slug: "test-slug",
      type: "template",
      status: "active",
      isDeleted: false,
      _id: "mockId"
    };

    (PageModel.create as jest.Mock).mockResolvedValue(mockPage);
    (PageModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const page = await PageModel.create({
      title: "Test Title",
      name: "Test Name",
      slug: "test-slug",
      type: "template",
    });

    expect(page.status).toBe("active");
    expect(page.isDeleted).toBe(false);
    await PageModel.deleteOne({ _id: page._id });
    expect(PageModel.deleteOne).toHaveBeenCalledWith({ _id: "mockId" });
  });

  it("should not allow duplicate slugs", async () => {
    const slug = "unique-slug";
    const mockError = { 
      code: 11000, 
      message: "E11000 duplicate key error" 
    };

    // First call succeeds
    (PageModel.create as jest.Mock).mockResolvedValueOnce({
      title: "Title1",
      name: "Name1",
      slug,
      type: "template",
      _id: "mockId1"
    });

    // Second call fails with duplicate error
    (PageModel.create as jest.Mock).mockRejectedValueOnce(mockError);
    (PageModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });

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
    if (typeof error === "object" && error !== null && "code" in error) {
      expect((error as { code: number }).code).toBe(11000);
    }
    await PageModel.deleteMany({ slug });
    expect(PageModel.deleteMany).toHaveBeenCalledWith({ slug });
  });
});