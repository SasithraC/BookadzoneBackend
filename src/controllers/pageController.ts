import { Request, Response, NextFunction } from "express";
import pagesService from "../services/pageService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class PagesController {
  async createPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = await pagesService.createPage(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page created", data: page });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await pagesService.getAllPages(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getPageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
        return;
      }
      const page = await pagesService.getPageById(id);
      if (!page) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: page });
    } catch (err: any) {
      next(err);
    }
  }

  async updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
        return;
      }
      const page = await pagesService.updatePage(id, req.body);
      if (!page) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page updated", data: page });
    } catch (err: any) {
      next(err);
    }
  }

   async softDeletePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
        return;
      }

      const page = await pagesService.softDeletePage(id);
      if (!page) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
        return;
      }

      // Include updated Page document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page deleted successfully", data: page });
    } catch (err: any) {
      next(err);
    }
  }

  async togglePageStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      if (!req.params.id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
        return;
      }
      const updated = await pagesService.toggleStatus(req.params.id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page status toggled", data: updated });
    } catch (error) {
      next(error);
    }
  }
    async getAllTrashPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await pagesService.getAllTrashPages(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async restorePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
        return;
      }

      const page = await pagesService.restorePage(id);
      if (!page) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
        return;
      }

      // Include updated Page document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page restored successfully", data: page });
    } catch (err: any) {
      next(err);
    }
  }

  async deletePagePermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
        return;
      }
      const page = await pagesService.deletePagePermanently(id);
      if (!page) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new PagesController();
