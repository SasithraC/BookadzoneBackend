import { Request, Response, NextFunction } from "express";
import blogCategoryService from "../services/blogCategory";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class BlogCategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('=================req',req,res);
    
    try {
      const category = await blogCategoryService.createCategory(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category created", data: category });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await blogCategoryService.getAllCategories(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const category = await blogCategoryService.getCategoryById(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const category = await blogCategoryService.updateCategory(id, req.body);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category updated", data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const category = await blogCategoryService.deleteCategory(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category deleted", data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const updated = await blogCategoryService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category status toggled", data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogCategoryController();