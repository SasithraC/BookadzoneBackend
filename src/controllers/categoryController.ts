import { Request, Response, NextFunction } from "express";
import categoryService from "../services/categoryService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class CategoryController {

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      data.photo = files?.photo?.[0]?.path.replace(/\\/g, '/') || '';

      const category = await categoryService.createCategory(data);

      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Category created",
        data: category,
      });
    } catch (err: any) {
      if (err.message === "Category name already exists") {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Category name already exists",
        });
      } else {
        next(err);
      }
    }
  }




  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await categoryService.getCategory(page, limit);
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
      const category = await categoryService.getCategoryById(id);
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
      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files?.photo?.[0]) {
        data.photo = files.photo[0].path.replace(/\\/g, '/');
      }

      const category = await categoryService.updateCategory(id, data);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category updated", data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const category = await categoryService.softDeleteCategory(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category deleted", data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const category = await categoryService.restoreCategory(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category restored successfully", data: category });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrashCategorys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await categoryService.getAllTrashCategorys(page, limit);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
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
      const updated = await categoryService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category status toggled", data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteCategoryPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const category = await categoryService.deleteCategoryPermanently(id);
      if (!category) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new CategoryController();

