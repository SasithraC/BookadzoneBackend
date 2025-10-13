import { Request, Response, NextFunction } from "express";
import blogCategoryService from "../services/blogCategoryService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class BlogCategoryController {
  async createBlogCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogCategory = await blogCategoryService.createBlogCategory(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "BlogCategory created", data: blogCategory });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllBlogCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await blogCategoryService.getAllBlogCategories(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getBlogCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory id is required" });
        return;
      }
      const blogCategory = await blogCategoryService.getBlogCategoryById(id);
      if (!blogCategory) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: blogCategory });
    } catch (err: any) {
      next(err);
    }
  }

  async updateBlogCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory id is required" });
        return;
      }
      const blogCategory = await blogCategoryService.updateBlogCategory(id, req.body);
      if (!blogCategory) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "BlogCategory updated", data: blogCategory });
    } catch (err: any) {
      next(err);
    }
  }

   async softDeleteBlogCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory id is required" });
        return;
      }

      const blogCategory = await blogCategoryService.softDeleteBlogCategory(id);
      if (!blogCategory) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory not found" });
        return;
      }

      // Include updated BlogCategory document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "BlogCategory deleted successfully", data: blogCategory });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleBlogCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory id is required" });
        return;
      }
      const updated = await blogCategoryService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "BlogCategory status toggled", data: updated });
    } catch (error) {
      next(error);
    }
  }
    async getAllTrashBlogCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await blogCategoryService.getAllTrashBlogCategories(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreBlogCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory id is required" });
        return;
      }

      const blogCategory = await blogCategoryService.restoreBlogCategory(id);
      if (!blogCategory) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory not found" });
        return;
      }

      // Include updated BlogCategory document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "BlogCategory restored successfully", data: blogCategory });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteBlogCategoryPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory id is required" });
        return;
      }
      const blogCategory = await blogCategoryService.deleteBlogCategoryPermanently(id);
      if (!blogCategory) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "BlogCategory not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "BlogCategory permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new BlogCategoryController();