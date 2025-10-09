import { Request, Response, NextFunction } from "express";
// import categoryService from "../services/categoryService";
import blogsService from "../services/blogsService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class BlogController {

  async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      data.blogImg = files?.blogImg?.[0]?.path.replace(/\\/g, '/') || '';

      const blog = await blogsService.createBlog(data);

      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Blog created",
        data: blog,
      });
    } catch (err: any) {
      if (err.message === "Blog name already exists") {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Blog name already exists",
        });
      } else {
        next(err);
      }
    }
  }




  async getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await blogsService.getAllBlogs(page, limit);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Blog id is required" });
        return;
      }
      const blog = await blogsService.getBlogById(id);
      if (!blog) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Blog not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: blog });
    } catch (err: any) {
      next(err);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Blog id is required" });
        return;
      }
      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files?.blogImg?.[0]) {
        data.blogImg = files.blogImg[0].path.replace(/\\/g, '/');
      }

      const blog = await blogsService.updateBlog(id, data);
      if (!blog) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Blog not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Blog updated", data: blog });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Blog id is required" });
        return;
      }
      const blog = await blogsService.softDeleteBlog(id);
      if (!blog) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Blog not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Blog deleted", data: blog });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Blog id is required" });
        return;
      }
      const blog = await blogsService.restoreBlog(id);
      if (!blog) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Blog not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Blog restored successfully", data: blog });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrashBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await blogsService.getAllTrashBlogs(page, limit);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleBlogStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Blog id is required" });
        return;
      }
      const updated = await blogsService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Blog not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Blog status toggled", data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteBlogPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Blog id is required" });
        return;
      }
      const blog = await blogsService.deleteBlogPermanently(id);
      if (!blog) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Blog not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Blog permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new BlogController();

