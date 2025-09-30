import { Request, Response, NextFunction } from "express";
import agencyService from "../services/agencyService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class AgencyController {
  async createAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      data.agencyLogo = files?.agencyLogo?.[0]?.path.replace(/\\/g, '/') || '';
      data.photo = files?.photo?.[0]?.path.replace(/\\/g, '/') || '';
      data.uploadIdProof = files?.uploadIdProof?.[0]?.path.replace(/\\/g, '/') || '';
      data.uploadBusinessProof = files?.uploadBusinessProof?.[0]?.path.replace(/\\/g, '/') || '';

      const agency = await agencyService.createAgency(data);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency created", data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllAgencies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await agencyService.getAllAgencies(page, limit);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getAgencyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
      const agency = await agencyService.getAgencyById(id);
      if (!agency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async updateAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files?.agencyLogo?.[0]) {
        data.agencyLogo = files.agencyLogo[0].path.replace(/\\/g, '/');
      }
      if (files?.photo?.[0]) {
        data.photo = files.photo[0].path.replace(/\\/g, '/');
      }
      if (files?.uploadIdProof?.[0]) {
        data.uploadIdProof = files.uploadIdProof[0].path.replace(/\\/g, '/');
      }
      if (files?.uploadBusinessProof?.[0]) {
        data.uploadBusinessProof = files.uploadBusinessProof[0].path.replace(/\\/g, '/');
      }

      const agency = await agencyService.updateAgency(id, data);
      if (!agency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency updated", data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
        const agency = await agencyService.deleteAgency(id);
        if (!agency) {
          res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
          return;
        }
        res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency deleted", data: agency });
    } catch (err: any) {
      next(err);
    }
  }

    async restoreAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        if (!id) {
          res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
          return;
        }
        const agency = await agencyService.restoreAgency(id);
        if (!agency) {
          res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
          return;
        }
        res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency restored successfully", data: agency });
      } catch (err: any) {
        next(err);
      }
    }

    async getAllTrashAgencies(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await agencyService.getAllTrashAgencies(page, limit);
        res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
      } catch (err: any) {
        next(err);
      }
    }

    async toggleAgencyStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        if (!id) {
          res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
          return;
        }
        const updated = await agencyService.toggleStatus(id);
        if (!updated) {
          res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
          return;
        }
        res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency status toggled", data: updated });
      } catch (err: any) {
        next(err);
      }
    }

    async deleteAgencyPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        if (!id) {
          res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
          return;
        }
        const agency = await agencyService.deleteAgencyPermanently(id);
        if (!agency) {
          res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
          return;
        }
        res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency permanently deleted" });
      } catch (err: any) {
        next(err);
      }
    }
}

export default new AgencyController();
