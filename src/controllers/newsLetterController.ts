import { Request, Response, NextFunction } from "express";
import newsLetterService from "../services/newsLetterService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class NewsLetterController {
  async createNewsLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newsLetter = await newsLetterService.createNewsLetter(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "NewsLetter created", data: newsLetter });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllNewsLetters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await newsLetterService.getAllNewsLetters(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getNewsLetterById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter id is required" });
        return;
      }
      const newsLetter = await newsLetterService.getNewsLetterById(id);
      if (!newsLetter) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: newsLetter });
    } catch (err: any) {
      next(err);
    }
  }

  async updateNewsLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter id is required" });
        return;
      }
      const newsLetter = await newsLetterService.updateNewsLetter(id, req.body);
      if (!newsLetter) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "NewsLetter updated", data: newsLetter });
    } catch (err: any) {
      next(err);
    }
  }

   async softDeleteNewsLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter id is required" });
        return;
      }

      const newsLetter = await newsLetterService.softDeleteNewsLetter(id);
      if (!newsLetter) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter not found" });
        return;
      }

      // Include updated NewsLetter document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "NewsLetter deleted successfully", data: newsLetter });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleNewsLetterStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter id is required" });
        return;
      }
      const updated = await newsLetterService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "NewsLetter status toggled", data: updated });
    } catch (error) {
      next(error);
    }
  }
    async getAllTrashNewsLetters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await newsLetterService.getAllTrashNewsLetters(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreNewsLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter id is required" });
        return;
      }

      const newsLetter = await newsLetterService.restoreNewsLetter(id);
      if (!newsLetter) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter not found" });
        return;
      }

      // Include updated NewsLetter document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "NewsLetter restored successfully", data: newsLetter });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteNewsLetterPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter id is required" });
        return;
      }
      const newsLetter = await newsLetterService.deleteNewsLetterPermanently(id);
      if (!newsLetter) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "NewsLetter not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "NewsLetter permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new NewsLetterController();