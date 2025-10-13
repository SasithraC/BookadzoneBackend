import { Request, Response, NextFunction } from 'express';
import footerInfoService from '../services/footerInfoService';
import { HTTP_RESPONSE } from '../utils/httpResponse';
import path from 'path';

class FooterInfoController {
  async createFooterInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file && !req.body.logo) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Logo file is required' });
        return;
      }
      let logoUrl = req.body.logo;
      if (req.file) {
        logoUrl = path.join('uploads', 'footer', 'logo', req.file.filename).replace(/\\/g, '/'); 
       
      }
      const footerinfo = await footerInfoService.createFooterInfo({ ...req.body, logo: logoUrl }, req.file);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Footer Info created', data: footerinfo });
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
    }
  }

  async getFooterInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const footerinfo = await footerInfoService.getFooterInfo(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: footerinfo });
    } catch (err: any) {
      next(err);
    }
  }

  async getFooterInfoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info id is required' });
        return;
      }
      const footerinfo = await footerInfoService.getFooterInfoById(id);
      if (!footerinfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: footerinfo });
    } catch (err: any) {
      next(err);
    }
  }

  async updateFooterInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info id is required' });
        return;
      }
      let logoUrl = req.body.logo;
      if (req.file) {
        logoUrl = path.join('uploads', 'footer', 'logo', req.file.filename).replace(/\\/g, '/'); // Full path
        // Alternatively, use only filename: logoUrl = req.file.filename;
      }
      const footerinfo = await footerInfoService.updateFooterInfo(id, { ...req.body, logo: logoUrl }, req.file);
      if (!footerinfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Footer Info updated', data: footerinfo });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteFooterInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info id is required' });
        return;
      }
      const footerinfo = await footerInfoService.softDeleteFooterInfo(id);
      if (!footerinfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Footer Info deleted successfully', data: footerinfo });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleFooterInfoStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info id is required' });
        return;
      }
      const updated = await footerInfoService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Footer Info status toggled', data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrashFooterInfos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await footerInfoService.getAllTrashFooterInfos(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreFooterInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info id is required' });
        return;
      }
      const footerinfo = await footerInfoService.restoreFooterInfo(id);
      if (!footerinfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Footer Info restored successfully', data: footerinfo });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteFooterInfoPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info id is required' });
        return;
      }
      const footerinfo = await footerInfoService.deleteFooterInfoPermanently(id);
      if (!footerinfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: 'Footer Info not found' });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: 'Footer Info permanently deleted' });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new FooterInfoController();