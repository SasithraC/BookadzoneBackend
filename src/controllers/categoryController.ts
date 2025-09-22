import { Request, Response, NextFunction } from "express";
import categoryService from "../services/categoryService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import multer from "multer";

class CategoryController {
  async createCategory(req: any, res: Response, next: NextFunction): Promise<void> {
    console.log("inside createCategory", req.body, "req",);
    console.log("Form Data (Text):", req.body);

    // 👉 File(s) from form-data
    console.log("Uploaded File:", req?.file);


    const upload = multer({
      dest: "uploads/",
      limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
      fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only JPG/PNG images are allowed"));
        }
      }
    });

    try {
      const category = await categoryService.createCategory(req.body, req?.file);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category created", data: category });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllCategorys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await categoryService.getAllCategory(page, limit, filter);
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
      console.log("id",id);
      
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category id is required" });
        return;
      }
      const category = await categoryService.updateCategory(id, req.body);
      console.log("req.body",req.body);
      
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

      // Include updated Category document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category deleted successfully", data: category });
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
    } catch (error) {
      next(error);
    }
  }
  async getAllTrashCategorys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await categoryService.getAllTrashCategorys(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
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

      // Include updated Category document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category restored successfully", data: category });
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