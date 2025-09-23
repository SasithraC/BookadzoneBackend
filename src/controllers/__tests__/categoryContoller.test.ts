import request from "supertest";
import express, { Express } from "express";
import CategoryController from "../categoryController";
import categoryService from "../../services/categoryService";
import { HTTP_RESPONSE } from "../../utils/httpResponse";

jest.mock("../../services/categoryService");

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/category", CategoryController.createCategory.bind(CategoryController));
app.get("/category", CategoryController.getAllCategorys.bind(CategoryController));
app.get("/category/:id", CategoryController.getCategoryById.bind(CategoryController));
app.put("/category/:id", CategoryController.updateCategory.bind(CategoryController));
app.delete("/category/:id", CategoryController.softDeleteCategory.bind(CategoryController));
app.patch("/category/status/:id", CategoryController.toggleCategoryStatus.bind(CategoryController));
app.get("/category-trash", CategoryController.getAllTrashCategorys.bind(CategoryController));
app.patch("/category-restore/:id", CategoryController.restoreCategory.bind(CategoryController));
app.delete("/category-permanent/:id", CategoryController.deleteCategoryPermanently.bind(CategoryController));

describe("CategoryController", () => {
  const mockCategory = {
    _id: "123",
    name: "Test Category",
    status: "active",
    isDeleted: false,
  };

  // ✅ Success Cases
  it("should create a category", async () => {
    (categoryService.createCategory as jest.Mock).mockResolvedValue(mockCategory);
    const res = await request(app).post("/category").send({ name: "Test Category" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe(HTTP_RESPONSE.SUCCESS);
    expect(res.body.data).toEqual(mockCategory);
  });

  it("should get all categories", async () => {
    (categoryService.getAllCategory as jest.Mock).mockResolvedValue({
      data: [mockCategory],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
    const res = await request(app).get("/category");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([mockCategory]);
  });

  it("should get category by ID", async () => {
    (categoryService.getCategoryById as jest.Mock).mockResolvedValue(mockCategory);
    const res = await request(app).get("/category/123");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockCategory);
  });

  it("should update category", async () => {
    (categoryService.updateCategory as jest.Mock).mockResolvedValue({ ...mockCategory, name: "Updated" });
    const res = await request(app).put("/category/123").send({ name: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated");
  });

  it("should soft delete category", async () => {
    (categoryService.softDeleteCategory as jest.Mock).mockResolvedValue({ ...mockCategory, isDeleted: true });
    const res = await request(app).delete("/category/123");
    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(true);
  });

  it("should toggle category status", async () => {
    (categoryService.toggleStatus as jest.Mock).mockResolvedValue({ ...mockCategory, status: "inactive" });
    const res = await request(app).patch("/category/status/123");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("inactive");
  });

  it("should get all trash categories", async () => {
    (categoryService.getAllTrashCategorys as jest.Mock).mockResolvedValue({
      data: [mockCategory],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
    const res = await request(app).get("/category-trash");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([mockCategory]);
  });

  it("should restore category", async () => {
    (categoryService.restoreCategory as jest.Mock).mockResolvedValue({ ...mockCategory, isDeleted: false });
    const res = await request(app).patch("/category-restore/123");
    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(false);
  });

  it("should permanently delete category", async () => {
    (categoryService.deleteCategoryPermanently as jest.Mock).mockResolvedValue(mockCategory);
    const res = await request(app).delete("/category-permanent/123");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category permanently deleted");
  });

  // ❌ Failure Cases
  it("should return 404 if category not found in getCategoryById", async () => {
    (categoryService.getCategoryById as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get("/category/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it("should return 404 if category not found in updateCategory", async () => {
    (categoryService.updateCategory as jest.Mock).mockResolvedValue(null);
    const res = await request(app).put("/category/999").send({ name: "Updated" });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it("should return 404 if category not found in softDeleteCategory", async () => {
    (categoryService.softDeleteCategory as jest.Mock).mockResolvedValue(null);
    const res = await request(app).delete("/category/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it("should return 404 if category not found in toggleStatus", async () => {
    (categoryService.toggleStatus as jest.Mock).mockResolvedValue(null);
    const res = await request(app).patch("/category/status/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it("should return 404 if category not found in restoreCategory", async () => {
    (categoryService.restoreCategory as jest.Mock).mockResolvedValue(null);
    const res = await request(app).patch("/category-restore/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  it("should return 404 if category not found in deleteCategoryPermanently", async () => {
    (categoryService.deleteCategoryPermanently as jest.Mock).mockResolvedValue(null);
    const res = await request(app).delete("/category-permanent/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found");
  });

  // ⚠️ Edge & Error Cases
  it("should return 409 if category already exists", async () => {
    (categoryService.createCategory as jest.Mock).mockRejectedValue(new Error("Category already exists"));
    const res = await request(app).post("/category").send({ name: "Test Category" });
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Category already exists");
  });

  it("should return 500 if createCategory throws unexpected error", async () => {
    (categoryService.createCategory as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    const res = await request(app).post("/category").send({ name: "Test Category" });
    expect(res.status).toBe(500);
  });

  it("should return 500 if updateCategory throws unexpected error", async () => {
    (categoryService.updateCategory as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    const res = await request(app).put("/category/123").send({ name: "Updated" });
    expect(res.status).toBe(500);
  });

  it("should return 500 if softDeleteCategory throws unexpected error", async () => {
    (categoryService.softDeleteCategory as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    const res = await request(app).delete("/category/123");
    expect(res.status).toBe(500);
  });

  it("should return 500 if toggleStatus throws unexpected error", async () => {
    (categoryService.toggleStatus as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    const res = await request(app).patch("/category/status/123");
    expect(res.status).toBe(500);
  });

  it("should return 500 if restoreCategory throws unexpected error", async () => {
    (categoryService.restoreCategory as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    const res = await request(app).patch("/category-restore/123");
    expect(res.status).toBe(500);
  });

  it("should return 500 if deleteCategoryPermanently throws unexpected error", async () => {
    (categoryService.deleteCategoryPermanently as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    const res = await request(app).delete("/category-permanent/123");
    expect(res.status).toBe(500);
  });

  it("should handle invalid query params in getAllCategorys", async () => {
    (categoryService.getAllCategory as jest.Mock).mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    });
    const res = await request(app).get("/category?page=abc&limit=xyz&status=unknown");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBe(0);
    expect(res.body.meta.totalPages).toBe(1);
  });
});
