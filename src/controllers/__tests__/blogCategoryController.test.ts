import { Request, Response, NextFunction } from "express";
import blogCategoryController from "../../controllers/blogCategoryController";
import blogCategoryService from "../../services/blogCategoryService";

// Mock dependencies
jest.mock('../../services/blogCategoryService');
jest.mock('../../middleware/authentication', () => ({
  authenticate: (req: any, res: any, next: any) => next(),
}));

describe("BlogCategoryController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let categoryId: string;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
    categoryId = "test-category-id";
  });

  describe("createBlogCategory", () => {
    it("returns 409 if BlogCategory already exists", async () => {
      const mockError = new Error("BlogCategory with this slug already exists");
      mockReq.body = { name: "Duplicate Category", status: "active" };
      (blogCategoryService.createBlogCategory as jest.Mock).mockRejectedValue(mockError);

      await blogCategoryController.createBlogCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(blogCategoryService.createBlogCategory).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "BlogCategory with this slug already exists"
      }));
    });

    it("creates a BlogCategory", async () => {
      mockReq.body = { name: "Test Category", status: "active" };
      const mockCategory = { _id: categoryId, ...mockReq.body };
      (blogCategoryService.createBlogCategory as jest.Mock).mockResolvedValue(mockCategory);

      await blogCategoryController.createBlogCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockCategory
      }));
    });
  });

  describe("getAllBlogCategories", () => {
    it("retrieves all BlogCategories", async () => {
      const mockResult = {
        data: [{ _id: categoryId, name: "Test Category" }],
        meta: { total: 1, page: 1, limit: 10 }
      };
      (blogCategoryService.getAllBlogCategories as jest.Mock).mockResolvedValue(mockResult);

      await blogCategoryController.getAllBlogCategories(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockResult.data
      }));
    });
  });

  describe("getBlogCategoryById", () => {
    it("retrieves a BlogCategory by ID", async () => {
      mockReq.params = { id: categoryId };
      const mockCategory = { _id: categoryId, name: "Test Category" };
      (blogCategoryService.getBlogCategoryById as jest.Mock).mockResolvedValue(mockCategory);

      await blogCategoryController.getBlogCategoryById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockCategory
      }));
    });
  });

  describe("updateBlogCategory", () => {
    it("updates a BlogCategory", async () => {
      mockReq.params = { id: categoryId };
      mockReq.body = { name: "Updated Category" };
      const mockUpdatedCategory = { _id: categoryId, ...mockReq.body };
      (blogCategoryService.updateBlogCategory as jest.Mock).mockResolvedValue(mockUpdatedCategory);

      await blogCategoryController.updateBlogCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockUpdatedCategory
      }));
    });
  });

  describe("toggleBlogCategoryStatus", () => {
    it("toggles BlogCategory status", async () => {
      mockReq.params = { id: categoryId };
      const mockToggledCategory = { _id: categoryId, status: "inactive" };
      (blogCategoryService.toggleStatus as jest.Mock).mockResolvedValue(mockToggledCategory);

      await blogCategoryController.toggleBlogCategoryStatus(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockToggledCategory
      }));
    });
  });

  describe("softDeleteBlogCategory", () => {
    it("soft deletes a BlogCategory", async () => {
      mockReq.params = { id: categoryId };
      const mockDeletedCategory = { _id: categoryId, isDeleted: true };
      (blogCategoryService.softDeleteBlogCategory as jest.Mock).mockResolvedValue(mockDeletedCategory);

      await blogCategoryController.softDeleteBlogCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockDeletedCategory
      }));
    });
  });

  describe("restoreBlogCategory", () => {
    it("restores a BlogCategory", async () => {
      mockReq.params = { id: categoryId };
      const mockRestoredCategory = { _id: categoryId, isDeleted: false };
      (blogCategoryService.restoreBlogCategory as jest.Mock).mockResolvedValue(mockRestoredCategory);

      await blogCategoryController.restoreBlogCategory(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockRestoredCategory
      }));
    });
  });

  describe("getAllTrashBlogCategories", () => {
    it("retrieves BlogCategories from trash", async () => {
      const mockTrashCategories = {
        data: [{ _id: categoryId, isDeleted: true }],
        meta: { total: 1, page: 1, limit: 10 }
      };
      (blogCategoryService.getAllTrashBlogCategories as jest.Mock).mockResolvedValue(mockTrashCategories);

      await blogCategoryController.getAllTrashBlogCategories(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        data: mockTrashCategories.data
      }));
    });
  });

  describe("deleteBlogCategoryPermanently", () => {
    it("permanently deletes a BlogCategory", async () => {
      mockReq.params = { id: categoryId };
      (blogCategoryService.deleteBlogCategoryPermanently as jest.Mock).mockResolvedValue({ _id: categoryId });

      await blogCategoryController.deleteBlogCategoryPermanently(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("deleted")
      }));
    });
  });
});
