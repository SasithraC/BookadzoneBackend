import blogCategoryRepository from "../blogCategoryRepository";
import { BlogCategoryModel } from "../../models/blogCategoryModel";

// Mock Mongoose Types
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn().mockReturnValue(true)
    }
  }
}));

// Mock BlogCategoryModel and common repository
jest.mock("../../models/blogCategoryModel", () => ({
  BlogCategoryModel: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(1)
    })
  }
}));

// Mock CommonRepository
jest.mock("../commonRepository", () => ({
  CommonRepository: class {
    async getStats() {
      return { total: 2, active: 1, inactive: 1 };
    }
  }
}));

describe("BlogCategoryRepository", () => {
  let categoryId: string;
  const defaultMockCategory = {
    _id: "test-id",
    id: "test-id",
    name: "RepoTech",
    status: "active",
    isDeleted: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    categoryId = "test-id";

    // Mock create
    (BlogCategoryModel.create as jest.Mock).mockImplementation(data => ({
      ...defaultMockCategory,
      ...data,
      toObject: () => ({ ...defaultMockCategory, ...data })
    }));

    // Mock single document operations
    (BlogCategoryModel.findById as jest.Mock).mockResolvedValue(defaultMockCategory);
    (BlogCategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(defaultMockCategory);
    (BlogCategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValue(defaultMockCategory);

    // Mock countDocuments
    (BlogCategoryModel.countDocuments as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(1)
    });

    // Default find mock - will be overridden in specific tests
    (BlogCategoryModel.find as jest.Mock).mockImplementation(() => ({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([defaultMockCategory])
        })
      })
    }));
  });

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
    expect(found?.id).toBe(categoryId);
  });

  it("updates BlogCategory", async () => {
    const updatedData = { name: "Updated RepoTech" };
    (BlogCategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...defaultMockCategory,
      ...updatedData
    });
    const updated = await blogCategoryRepository.updateBlogCategory(categoryId, updatedData);
    expect(updated?.name).toBe("Updated RepoTech");
  });

  it("soft deletes BlogCategory", async () => {
    (BlogCategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...defaultMockCategory,
      isDeleted: true
    });
    const deleted = await blogCategoryRepository.softDeleteBlogCategory(categoryId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it("restores BlogCategory", async () => {
    (BlogCategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...defaultMockCategory,
      isDeleted: false,
      status: "active"
    });
    const restored = await blogCategoryRepository.restoreBlogCategory(categoryId);
    expect(restored?.isDeleted).toBe(false);
    expect(restored?.status).toBe("active");
  });

  it("gets all BlogCategories with pagination", async () => {
    const mockData = [defaultMockCategory, { ...defaultMockCategory, id: "test-id-2" }];
    const mockLimit = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockData) });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    
    (BlogCategoryModel.find as jest.Mock).mockReturnValue({
      skip: mockSkip
    });

    const result = await blogCategoryRepository.getAllBlogCategories(1, 10);
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(10);
    expect(result.meta).toBeDefined();
    expect(result.meta.total).toBe(2);
    expect(result.meta.page).toBe(1);
  });

  it("gets filtered active BlogCategories", async () => {
    const mockData = [defaultMockCategory];
    const mockLimit = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockData) });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    
    (BlogCategoryModel.find as jest.Mock).mockReturnValue({
      skip: mockSkip
    });

    const result = await blogCategoryRepository.getAllBlogCategories(1, 10, "active");
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(10);
    expect(BlogCategoryModel.find).toHaveBeenCalledWith(
      expect.objectContaining({ status: "active", isDeleted: false })
    );
  });

  it("handles empty results", async () => {
    const mockLimit = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    
    (BlogCategoryModel.find as jest.Mock).mockReturnValue({
      skip: mockSkip
    });

    const result = await blogCategoryRepository.getAllBlogCategories(1, 10);
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(10);
    expect(result.meta.page).toBe(1);
    expect(result.meta.total).toBe(2);
  });
});
