import CategoryRepository from "../categoryRepository";
import { CategoryModel, ICategory } from "../../models/catrgoryModel";
import { CommonRepository } from "../common.repository";
import { Types } from "mongoose";

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
jest.mock("../common.repository", () => {
  return {
    CommonRepository: jest.fn().mockImplementation(() => ({
      getStats: jest.fn().mockResolvedValue({ total: 100 }),
      toggleStatus: jest.fn().mockResolvedValue({ status: "inactive" }),
    })),
  };
});

describe("CategoryRepository", () => {
  const repo = CategoryRepository; // ✅ Use the default-exported instance

  const mockCategory = {
    _id: new Types.ObjectId(),
    name: "Test Category",
    status: "active",
    isDeleted: false,
  };

it("should create a category", async () => {
  const mockCategory: Partial<ICategory> = {
    name: "Test Category",
    status: "active",
    isDeleted: false,
  };

  (CategoryModel.create as jest.Mock).mockResolvedValue(mockCategory);

  // Type assertion to ICategory to satisfy the type requirement
  const result = await repo.createCategory(mockCategory as ICategory);
  expect(result).toEqual(mockCategory);
  expect(CategoryModel.create).toHaveBeenCalledWith(mockCategory);
});

  it("should get all categories", async () => {
    (CategoryModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockCategory]),
    });

    const result = await repo.getAllCategory(1, 10);
    expect(result.data).toEqual([mockCategory]);
    expect(result.meta.totalPages).toBe(10);
  });

  it("should get category by ID", async () => {
    (CategoryModel.findById as jest.Mock).mockResolvedValue(mockCategory);
    const result = await repo.getCategoryById(mockCategory._id);
    expect(result).toEqual(mockCategory);
  });

  it("should update category", async () => {
    const updated = { ...mockCategory, name: "Updated" };
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
    const result = await repo.updateCategory(mockCategory._id, { name: "Updated" });
    expect(result).toEqual(updated);
  });

  it("should soft delete category", async () => {
    const deleted = { ...mockCategory, isDeleted: true };
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(deleted);
    const result = await repo.softDeleteCategory(mockCategory._id);
    expect(result).toEqual(deleted);
  });

  it("should toggle status", async () => {
    const result = await repo.toggleStatus(mockCategory._id);
    expect(result).toEqual({ status: "inactive" });
  });

  it("should restore category", async () => {
    const restored = { ...mockCategory, isDeleted: false, status: "active" };
    (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(restored);
    const result = await repo.restoreCategory(mockCategory._id);
    expect(result).toEqual(restored);
  });

  it("should permanently delete category", async () => {
    (CategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCategory);
    const result = await repo.deleteCategoryPermanently(mockCategory._id);
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