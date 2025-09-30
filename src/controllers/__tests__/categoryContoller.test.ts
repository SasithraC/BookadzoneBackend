import categoryController from "../categoryController";
import categoryService from "../../services/categoryService";
import { HTTP_RESPONSE } from "../../utils/httpResponse";

jest.mock("../../services/categoryService");

const mockReq = (overrides = {}) =>
  ({
    body: {},
    params: {},
    query: {},
    file: undefined,
    ...overrides,
  } as any);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("CategoryController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCategory", () => {
    it("returns 400 if photo is missing", async () => {
      const req = mockReq({ body: { name: "Test", description: "desc" } });
      const res = mockRes();
      await categoryController.createCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.FAIL,
        message: "Photo file is required for creation",
      });
    });

    it("returns 400 if description is missing", async () => {
      const req = mockReq({ body: { name: "Test" }, file: { filename: "p.png" } });
      const res = mockRes();
      await categoryController.createCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.FAIL,
        message: "description is required",
      });
    });

    it("returns 201 on success", async () => {
      const req = mockReq({
        body: { name: "Test", description: "desc", slug: "test" },
        file: { filename: "p.png" },
      });
      const res = mockRes();
      (categoryService.createCategory as jest.Mock).mockResolvedValue({ id: "123" });
      await categoryController.createCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Category created successfully",
        data: { id: "123" },
      });
    });

    it("returns 409 if duplicate", async () => {
      const req = mockReq({
        body: { name: "Test", description: "desc", slug: "test" },
        file: { filename: "p.png" },
      });
      const res = mockRes();
      (categoryService.createCategory as jest.Mock).mockRejectedValue(new Error("photo already exists"));
      await categoryController.createCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.FAIL,
        message: "photo already exists",
      });
    });

    it("calls next on unexpected error", async () => {
      const req = mockReq({
        body: { name: "Test", description: "desc", slug: "test" },
        file: { filename: "p.png" },
      });
      const res = mockRes();
      const error = new Error("Unexpected");
      (categoryService.createCategory as jest.Mock).mockRejectedValue(error);
      await categoryController.createCategory(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getCategory", () => {
    it("returns 200 with data", async () => {
      const req = mockReq({ query: { page: "1", limit: "10" } });
      const res = mockRes();
      (categoryService.getCategory as jest.Mock).mockResolvedValue(["cat"]);
      await categoryController.getCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Categories fetched successfully",
        data: ["cat"],
      });
    });

    it("calls next on error", async () => {
      const req = mockReq();
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.getCategory as jest.Mock).mockRejectedValue(error);
      await categoryController.getCategory(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getCategoryById", () => {
    it("returns 400 if id is missing", async () => {
      const req = mockReq();
      const res = mockRes();
      await categoryController.getCategoryById(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.FAIL,
        message: "Category ID is required",
      });
    });

    it("returns 404 if not found", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      (categoryService.getCategoryById as jest.Mock).mockResolvedValue(null);
      await categoryController.getCategoryById(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.FAIL,
        message: "Category not found",
      });
    });

    it("returns 200 if found", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      (categoryService.getCategoryById as jest.Mock).mockResolvedValue({ id: "123" });
      await categoryController.getCategoryById(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Category fetched successfully",
        data: { id: "123" },
      });
    });

    it("calls next on error", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.getCategoryById as jest.Mock).mockRejectedValue(error);
      await categoryController.getCategoryById(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateCategory", () => {
    it("returns 400 if id is missing", async () => {
      const req = mockReq();
      const res = mockRes();
      await categoryController.updateCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.FAIL,
        message: "Category ID is required",
      });
    });

    it("returns 200 on success", async () => {
      const req = mockReq({ params: { id: "123" }, body: { name: "Updated" } });
      const res = mockRes();
      (categoryService.updateCategory as jest.Mock).mockResolvedValue({ id: "123" });
      await categoryController.updateCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Category updated successfully",
        data: { id: "123" },
      });
    });

    it("calls next on error", async () => {
      const req = mockReq({ params: { id: "123" }, body: { name: "Updated" } });
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.updateCategory as jest.Mock).mockRejectedValue(error);
      await categoryController.updateCategory(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("softDeleteCategory", () => {
    it("returns 400 if id is missing", async () => {
      const req = mockReq();
      const res = mockRes();
      await categoryController.softDeleteCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 200 on success", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      (categoryService.softDeleteCategory as jest.Mock).mockResolvedValue({ id: "123" });
      await categoryController.softDeleteCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("calls next on error", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.softDeleteCategory as jest.Mock).mockRejectedValue(error);
      await categoryController.softDeleteCategory(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

   // TOGGLE STATUS
  describe("toggleCatgoryStatus", () => {
    it("returns 400 if id is missing", async () => {
      const req = mockReq();
      const res = mockRes();
      await categoryController.toggleCatgoryStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 200 on success", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      (categoryService.toggleStatus as jest.Mock).mockResolvedValue({ id: "123", status: "inactive" });
      await categoryController.toggleCatgoryStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Category status toggled successfully",
        data: { id: "123", status: "inactive" },
      });
    });

    it("calls next on error", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.toggleStatus as jest.Mock).mockRejectedValue(error);
      await categoryController.toggleCatgoryStatus(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // GET TRASH
  describe("getAllTrashCategorys", () => {
    it("returns 200 with data", async () => {
      const req = mockReq({ query: { page: "1", limit: "10" } });
      const res = mockRes();
      (categoryService.getAllTrashCategorys as jest.Mock).mockResolvedValue(["trash"]);
      await categoryController.getAllTrashCategorys(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Trashed categories fetched successfully",
        data: ["trash"],
      });
    });

    it("calls next on error", async () => {
      const req = mockReq();
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.getAllTrashCategorys as jest.Mock).mockRejectedValue(error);
      await categoryController.getAllTrashCategorys(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // RESTORE
  describe("restoreCategory", () => {
    it("returns 400 if id is missing", async () => {
      const req = mockReq();
      const res = mockRes();
      await categoryController.restoreCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 200 on success", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      (categoryService.restoreCategory as jest.Mock).mockResolvedValue({ id: "123" });
      await categoryController.restoreCategory(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Category restored successfully",
        data: { id: "123" },
      });
    });

    it("calls next on error", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.restoreCategory as jest.Mock).mockRejectedValue(error);
      await categoryController.restoreCategory(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // DELETE PERMANENTLY
  describe("deleteCategoryPermanently", () => {
    it("returns 400 if id is missing", async () => {
      const req = mockReq();
      const res = mockRes();
      await categoryController.deleteCategoryPermanently(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 200 on success", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      (categoryService.deleteCategoryPermanently as jest.Mock).mockResolvedValue({ id: "123" });
      await categoryController.deleteCategoryPermanently(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Category deleted permanently",
        data: { id: "123" },
      });
    });

    it("calls next on error", async () => {
      const req = mockReq({ params: { id: "123" } });
      const res = mockRes();
      const error = new Error("fail");
      (categoryService.deleteCategoryPermanently as jest.Mock).mockRejectedValue(error);
      await categoryController.deleteCategoryPermanently(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});