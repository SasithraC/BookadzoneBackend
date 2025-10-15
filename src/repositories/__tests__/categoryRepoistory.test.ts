import CategoryRepository from "../categoryRepository";
import { CategoryModel, ICategory } from "../../models/catrgoryModel";
import { CommonRepository } from "../commonRepository";

// Mocking Mongoose Model methods
jest.mock("../../models/catrgoryModel", () => ({
  CategoryModel: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

// Mocking CommonRepository
jest.mock("../commonRepository", () => {
  const mockGetStats = jest.fn().mockResolvedValue({ total: 100 });
  const mockToggleStatus = jest.fn().mockResolvedValue({ status: "inactive" });

  return {
    CommonRepository: jest.fn().mockImplementation(() => ({
      getStats: mockGetStats,
      toggleStatus: mockToggleStatus,
    })),
  };
});

describe("CategoryRepository", () => {
  const repo = CategoryRepository; 

  const mockCategory = {
    _id: "test-id-123",
    name: "Test Category",
    status: "active",
    isDeleted: false,
  };

  it("should create a category", async () => {
  const createMockCategory: Partial<ICategory> = {
    _id: "test-id-123",
    name: "Test Category",
    status: "active",
    isDeleted: false,
  };

  (CategoryModel.create as jest.Mock).mockResolvedValue(createMockCategory);

  // Type assertion to ICategory to satisfy the type requirement
  const result = await repo.createCategory(createMockCategory as ICategory);
  expect(result).toEqual(createMockCategory);
  expect(CategoryModel.create).toHaveBeenCalledWith(createMockCategory);
});  it("should get all categories", async () => {
    const mockCommonStats = { total: 100 };
    
    // Setup CommonRepository mock
    const mockStats = jest.spyOn(repo["commonRepository"], "getStats");
    mockStats.mockResolvedValue(mockCommonStats);

    // Setup CategoryModel.find mock
    (CategoryModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockCategory]),
    });

    const result = await repo.getCategory(1, 10);
    expect(result.data).toEqual([mockCategory]);
    expect(result.meta.totalPages).toBe(10);
    expect(mockStats).toHaveBeenCalled();
  });

  it("should get category by ID", async () => {
    (CategoryModel.findById as jest.Mock).mockResolvedValue(mockCategory);
    const result = await repo.getCategoryById("test-id-123");
    expect(result).toEqual(mockCategory);
  });

  it("should update category", async () => {
    const updated = { ...mockCategory, name: "Updated" };
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
    const result = await repo.updateCategory("test-id-123", { name: "Updated" });
    expect(result).toEqual(updated);
  });

  it("should soft delete category", async () => {
    const deleted = { ...mockCategory, isDeleted: true };
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(deleted);
    const result = await repo.softDeleteCategory("test-id-123");
    expect(result).toEqual(deleted);
  });

  it("should toggle status", async () => {
    const result = await repo.toggleStatus("test-id-123");
    expect(result).toEqual({ status: "inactive" });
  });

  it("should restore category", async () => {
    const restored = { ...mockCategory, isDeleted: false, status: "active" };
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(restored);
    const result = await repo.restoreCategory("test-id-123");
    expect(result).toEqual(restored);
  });

  it("should permanently delete category", async () => {
    (CategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCategory);
    const result = await repo.deleteCategoryPermanently("test-id-123");
    expect(result).toEqual(mockCategory);
  });

  it("should get all trash categories", async () => {
    (CategoryModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockCategory]),
    });
    (CategoryModel.countDocuments as jest.Mock).mockResolvedValue(10);

    const result = await repo.getAllTrashCategorys(1, 10);
    expect(result.data).toEqual([mockCategory]);
    expect(result.meta.total).toBe(10);
    expect(result.meta.totalPages).toBe(1);
  });
});