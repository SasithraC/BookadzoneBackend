import { Request, Response, NextFunction } from "express";
import configService from "../services/configService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class ConfigController {
  async createConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await configService.createConfig(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Config created", data: config });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllConfigs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await configService.getAllConfigs(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getConfigById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Config id is required" });
        return;
      }
      const config = await configService.getConfigById(id);
      if (!config) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Config not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: config });
    } catch (err: any) {
      next(err);
    }
  }

  async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Config id is required" });
        return;
      }
      const config = await configService.updateConfig(id, req.body);
      if (!config) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Config not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Config updated", data: config });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async softDeleteConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Config id is required" });
        return;
      }
      const updated = await configService.softDeleteConfig(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Config not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Config soft deleted", data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Config id is required" });
        return;
      }
      const updated = await configService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Config not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Config status toggled", data: updated });
    } catch (error) {
      next(error);
    }
  }

  async getAllTrashConfigs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await configService.getAllTrashConfigs(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Config id is required" });
        return;
      }

      const config = await configService.restoreConfig(id);
      if (!config) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Config not found" });
        return;
      }

      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Config restored successfully", data: config });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteConfigPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Config id is required" });
        return;
      }
      const config = await configService.deleteConfigPermanently(id);
      if (!config) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Config not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Config permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new ConfigController();