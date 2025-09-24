import categoryService from "../categoryService";
import categoryRepository from "../../repositories/categoryRepository";
import { ICategory } from "../../models/catrgoryModel";
import ValidationHelper from "../../utils/validationHelper";

// 🔹 Mock repository & validation helper
jest.mock("../../repositories/categoryRepository");
jest.mock("../../utils/validationHelper");

describe("CategoryService Unit Tests", () => {
  const mockCategory: Partial<ICategory> = {
  _id: "123" as any,
  name: "Test Category",
  slug: "test-category",
  description: "Test Desc",
  status: "active",
  isDeleted: false,
  isFeatured: true,
  photo: "test.jpg",
};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- CREATE ----------------
  it("should create category successfully", async () => {
    (ValidationHelper.validate as jest.Mock).mockReturnValue([]);
    (categoryRepository.createCategory as jest.Mock).mockResolvedValue(mockCategory);

    const result = await categoryService.createCategory(
      { name: "Test", slug: "slug", description: "desc", isFeatured: true } as any,
      "photo.jpg"
    );

    expect(result).toEqual(mockCategory);
    expect(categoryRepository.createCategory).toHaveBeenCalled();
  });

  it("should throw error if slug already exists", async () => {
    (ValidationHelper.validate as jest.Mock).mockReturnValue([]);
    (categoryService as any).commonService.existsByField = jest.fn().mockResolvedValue(true);

    await expect(
      categoryService.createCategory(
        { name: "dup", slug: "test-category", description: "desc", isFeatured: true } as any,
        "photo.jpg"
      )
    ).rejects.toThrow("Category with this slug already exists");
  });

  it("should throw validation error", async () => {
    (ValidationHelper.validate as jest.Mock).mockReturnValue([{ message: "Invalid data" }]);

    await expect(
      categoryService.createCategory({} as any, "photo.jpg")
    ).rejects.toThrow("Invalid data");
  });

  // ---------------- GET ALL ----------------
  it("should get all categories", async () => {
    (categoryRepository.getAllCategory as jest.Mock).mockResolvedValue({ data: [mockCategory], meta: {} });

    const result = await categoryService.getAllCategory(1, 10);
    expect(result.data).toHaveLength(1);
    expect(categoryRepository.getAllCategory).toHaveBeenCalledWith(1, 10, undefined);
  });

  // ---------------- GET BY ID ----------------
  it("should get category by id", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue(null);
    (categoryRepository.getCategoryById as jest.Mock).mockResolvedValue(mockCategory);

    const result = await categoryService.getCategoryById("123");
    expect(result).toEqual(mockCategory);
  });

  it("should throw error on invalid id in getCategoryById", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue({ message: "Invalid id" });

    await expect(categoryService.getCategoryById("badid")).rejects.toThrow("Invalid id");
  });

  // ---------------- UPDATE ----------------
  it("should update category", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue(null);
    (ValidationHelper.validate as jest.Mock).mockReturnValue([]);
    (categoryRepository.updateCategory as jest.Mock).mockResolvedValue({ ...mockCategory, name: "Updated" });

    const result = await categoryService.updateCategory("123", { name: "Updated" });
    expect(result?.name).toBe("Updated");
  });

  // ---------------- SOFT DELETE ----------------
  it("should soft delete category", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue(null);
    (categoryRepository.softDeleteCategory as jest.Mock).mockResolvedValue({ ...mockCategory, isDeleted: true });

    const result = await categoryService.softDeleteCategory("123");
    expect(result?.isDeleted).toBe(true);
  });

  // ---------------- RESTORE ----------------
  it("should restore category", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue(null);
    (categoryRepository.restoreCategory as jest.Mock).mockResolvedValue({ ...mockCategory, isDeleted: false });

    const result = await categoryService.restoreCategory("123");
    expect(result?.isDeleted).toBe(false);
  });

  // ---------------- TOGGLE STATUS ----------------
  it("should toggle status", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue(null);
    (categoryRepository.toggleStatus as jest.Mock).mockResolvedValue({ ...mockCategory, status: "inactive" });

    const result = await categoryService.toggleStatus("123");
    expect(["active", "inactive"]).toContain(result?.status);
  });

  // ---------------- GET TRASH ----------------
  it("should get trash categories", async () => {
    (categoryRepository.getAllTrashCategorys as jest.Mock).mockResolvedValue({ data: [mockCategory], meta: { total: 1 } });

    const result = await categoryService.getAllTrashCategorys(1, 10);
    expect(result.data.length).toBe(1);
  });

  // ---------------- DELETE PERMANENTLY ----------------
  it("should delete permanently", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue(null);
    (categoryRepository.deleteCategoryPermanently as jest.Mock).mockResolvedValue(mockCategory);

    const result = await categoryService.deleteCategoryPermanently("123");
    expect(result).toEqual(mockCategory);
  });

  it("should throw error on invalid id in deleteCategoryPermanently", async () => {
    (ValidationHelper.isValidObjectId as jest.Mock).mockReturnValue({ message: "Invalid id" });

    await expect(categoryService.deleteCategoryPermanently("badid")).rejects.toThrow("Invalid id");
  });
});
