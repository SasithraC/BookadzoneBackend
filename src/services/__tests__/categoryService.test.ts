import categoryService from "../categoryService";
import categoryRepository from "../../repositories/categoryRepository";
import { CommonService } from "../commonService";
import { CategoryModel, ICategory } from "../../models/catrgoryModel";
import { Types } from "mongoose";

jest.mock("../../repositories/categoryRepository");
jest.mock("../commonService");

const mockCategoryRepo = categoryRepository as jest.Mocked<typeof categoryRepository>;
const MockCommonService = CommonService as jest.MockedClass<typeof CommonService>;

jest.mock("../../utils/validationHelper", () => {
  const mockValidate = jest.fn().mockImplementation((rules = []) => Array.isArray(rules) ? rules.filter(rule => rule !== null && rule !== undefined) : []);
  return {
    __esModule: true,
    default: {
      isValidObjectId: jest.fn().mockImplementation((value, field) => {
        if (value === "invalid-id") {
          return { field, message: `Invalid ${field}` };
        }
        return null;
      }),
      validate: mockValidate,
      isRequired: jest.fn().mockImplementation((value, field) => {
        if (!value) {
          return { field, message: `${field} is required` };
        }
        return null;
      }),
      maxLength: jest.fn().mockImplementation((value, field, max) => {
        if (value && value.length > max) {
          return { field, message: `${field} must not exceed ${max} characters` };
        }
        return null;
      }),
      isValidEnum: jest.fn().mockImplementation((value, field, enums) => {
        if (!enums.includes(value)) {
          return { field, message: `${field} must be one of: ${enums.join(", ")}` };
        }
        return null;
      }),
      isNonEmptyString: jest.fn().mockImplementation((value, field) => {
        if (!value || value.trim() === "") {
          return { field, message: `${field} must be a non-empty string` };
        }
        return null;
      }),
      isBoolean: jest.fn().mockImplementation((value, field) => {
        if (typeof value !== "boolean") {
          return { field, message: `${field} must be a boolean` };
        }
        return null;
      })
    }
  };
});

describe("CategoryService", () => {

const file: Express.Multer.File = {
    fieldname: 'photo',
    originalname: 'photo.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: '/uploads',
    filename: 'photo.png',
    path: '/uploads/photo.png',
    size: 123,
    stream: null as any,
    buffer: Buffer.from('test')
  };

  beforeEach(() => {
    jest.clearAllMocks();
    MockCommonService.prototype.existsByField.mockResolvedValue(false);
  });

  describe("createCategory", () => {
    it("throws if photo is missing", async () => {
      await expect(categoryService.createCategory({ description: "desc" })).rejects.toThrow("Photo file is required for creation");
    });

    it("throws if description is missing", async () => {
      await expect(categoryService.createCategory({ name: "Test" }, file)).rejects.toThrow(/description/);
    });

    it("throws if status is invalid", async () => {
      await expect(categoryService.createCategory({ name: "Test", description: "desc", status: "wrong" } as any, file)).rejects.toThrow(/status must be one of/);
    });

    it("throws if photo already exists", async () => {
      MockCommonService.prototype.existsByField.mockResolvedValueOnce(true);
      await expect(categoryService.createCategory({ name: "Test", description: "desc" }, file)).rejects.toThrow(/photo already exists/);
    });

    it("creates category successfully", async () => {
      const mockCategory = { _id: "1", name: "Test", description: "desc", photo: "photo.png", status: "active" } as ICategory;
      mockCategoryRepo.createCategory.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory({ name: "Test", description: "desc", slug: "slug" }, file);
      expect(result).toEqual(mockCategory);
    });

    it("propagates repository error", async () => {
      mockCategoryRepo.createCategory.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.createCategory({ name: "Test", description: "desc" }, file)).rejects.toThrow("DB error");
    });
  });

  describe("getCategory", () => {
    it("returns paginated categories", async () => {
      const mockData = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      mockCategoryRepo.getCategory.mockResolvedValue(mockData as any);
      const result = await categoryService.getCategory(1, 10);
      expect(result).toEqual(mockData);
    });

    it("propagates error", async () => {
      mockCategoryRepo.getCategory.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.getCategory(1, 10)).rejects.toThrow("DB error");
    });
  });

  describe("getCategoryById", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.getCategoryById("invalid-id")).rejects.toThrow(/id/);
    });

    it("returns category if found", async () => {
      const mockCategory = { _id: "1", name: "Test" } as ICategory;
      mockCategoryRepo.getCategoryById.mockResolvedValue(mockCategory);
      const result = await categoryService.getCategoryById("1");
      expect(result).toEqual(mockCategory);
    });

    it("returns null if not found", async () => {
      mockCategoryRepo.getCategoryById.mockResolvedValue(null);
      const result = await categoryService.getCategoryById("missing");
      expect(result).toBeNull();
    });

    it("propagates error", async () => {
      mockCategoryRepo.getCategoryById.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.getCategoryById("1")).rejects.toThrow("DB error");
    });
  });

  describe("updateCategory", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.updateCategory("invalid-id", { name: "x" })).rejects.toThrow(/id/);
    });

    it("updates with new photo", async () => {
      const mockUpdated = { _id: "1", name: "Updated", photo: "new.png" } as ICategory;
      mockCategoryRepo.updateCategory.mockResolvedValue(mockUpdated);
      const result = await categoryService.updateCategory("1", { name: "Updated" }, file);
      expect(result).toEqual(mockUpdated);
    });

    it("updates without photo", async () => {
      const mockUpdated = { _id: "1", name: "Updated" } as ICategory;
      mockCategoryRepo.updateCategory.mockResolvedValue(mockUpdated);
      const result = await categoryService.updateCategory("1", { name: "Updated" });
      expect(result).toEqual(mockUpdated);
    });

    it("propagates error", async () => {
      mockCategoryRepo.updateCategory.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.updateCategory("1", { name: "x" })).rejects.toThrow("DB error");
    });
  });

  describe("softDeleteCategory", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.softDeleteCategory("invalid-id")).rejects.toThrow(/id/);
    });

    it("soft deletes", async () => {
      const mockDeleted = { _id: "1", isDeleted: true } as ICategory;
      mockCategoryRepo.softDeleteCategory.mockResolvedValue(mockDeleted);
      const result = await categoryService.softDeleteCategory("1");
      expect(result).toEqual(mockDeleted);
    });
  });

  describe("toggleStatus", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.toggleStatus("invalid-id")).rejects.toThrow(/id/);
    });

    it("toggles status", async () => {
      const mockToggled = { _id: "1", status: "inactive" } as ICategory;
      mockCategoryRepo.toggleStatus.mockResolvedValue(mockToggled);
      const result = await categoryService.toggleStatus("1");
      expect(result).toEqual(mockToggled);
    });
  });

  describe("getAllTrashCategorys", () => {
    it("returns trashed categories", async () => {
      const mockResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, active: 0, inactive: 0 },
      };
      mockCategoryRepo.getAllTrashCategorys.mockResolvedValue(mockResponse as any);
      const result = await categoryService.getAllTrashCategorys(1, 10);
      expect(result).toEqual(mockResponse);
    });

    it("propagates error", async () => {
      mockCategoryRepo.getAllTrashCategorys.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.getAllTrashCategorys(1, 10)).rejects.toThrow("DB error");
    });
  });

  describe("restoreCategory", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.restoreCategory("invalid-id")).rejects.toThrow(/id/);
    });

    it("restores category", async () => {
      const mockRestored = { _id: "1", isDeleted: false } as ICategory;
      mockCategoryRepo.restoreCategory.mockResolvedValue(mockRestored);
      const result = await categoryService.restoreCategory("1");
      expect(result).toEqual(mockRestored);
    });
  });

  describe("deleteCategoryPermanently", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.deleteCategoryPermanently("invalid-id")).rejects.toThrow(/id/);
    });

    it("deletes permanently", async () => {
      const mockDeleted = { _id: "1" } as ICategory;
      mockCategoryRepo.deleteCategoryPermanently.mockResolvedValue(mockDeleted);
      const result = await categoryService.deleteCategoryPermanently("1");
      expect(result).toEqual(mockDeleted);
    });
  });


    describe("restoreCategory", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.restoreCategory("invalid-id")).rejects.toThrow(/id/);
    });

    it("restores category", async () => {
      const mockRestored = { _id: "1", isDeleted: false } as ICategory;
      mockCategoryRepo.restoreCategory.mockResolvedValue(mockRestored);
      const result = await categoryService.restoreCategory("1");
      expect(result).toEqual(mockRestored);
    });

    it("propagates error", async () => {
      mockCategoryRepo.restoreCategory.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.restoreCategory("1")).rejects.toThrow("DB error");
    });
  });

  describe("deleteCategoryPermanently", () => {
    it("throws error on invalid ObjectId", async () => {
      await expect(categoryService.deleteCategoryPermanently("invalid-id")).rejects.toThrow(/id/);
    });

    it("deletes permanently", async () => {
      const mockDeleted = { _id: "1" } as ICategory;
      mockCategoryRepo.deleteCategoryPermanently.mockResolvedValue(mockDeleted);
      const result = await categoryService.deleteCategoryPermanently("1");
      expect(result).toEqual(mockDeleted);
    });

    it("propagates error", async () => {
      mockCategoryRepo.deleteCategoryPermanently.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.deleteCategoryPermanently("1")).rejects.toThrow("DB error");
    });
  });

  describe("softDeleteCategory", () => {
    it("returns null if not found", async () => {
      mockCategoryRepo.softDeleteCategory.mockResolvedValue(null);
      const result = await categoryService.softDeleteCategory("999");
      expect(result).toBeNull();
    });

    it("propagates error", async () => {
      mockCategoryRepo.softDeleteCategory.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.softDeleteCategory("1")).rejects.toThrow("DB error");
    });
  });

  describe("toggleStatus", () => {
    it("returns null if not found", async () => {
      mockCategoryRepo.toggleStatus.mockResolvedValue(null);
      const result = await categoryService.toggleStatus("999");
      expect(result).toBeNull();
    });

    it("propagates error", async () => {
      mockCategoryRepo.toggleStatus.mockRejectedValue(new Error("DB error"));
      await expect(categoryService.toggleStatus("1")).rejects.toThrow("DB error");
    });
  });

  describe("updateCategory", () => {
    it("throws validation error for invalid status", async () => {
      await expect(
        categoryService.updateCategory("1", { name: "Test", description: "desc", status: "wrong" } as any)
      ).rejects.toThrow(/status must be one of/);
    });
  });

  describe("createCategory", () => {
    it("throws validation error for long name", async () => {
      const longName = "x".repeat(201);
      await expect(categoryService.createCategory({ name: longName, description: "desc" }, file)).rejects.toThrow(/name/);
    });

    it("throws validation error for long slug", async () => {
      const longSlug = "x".repeat(201);
      await expect(categoryService.createCategory({ slug: longSlug, description: "desc" }, file)).rejects.toThrow(/slug/);
    });
  });
});