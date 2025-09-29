import settingsController from '../settingsController';
import settingsService from '../../services/settingsService';
import { Request, Response } from 'express';

jest.mock('../../services/settingsService');

describe('settingsController', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should get settings successfully', async () => {
    (settingsService.getSettings as jest.Mock).mockResolvedValue({ general: {} });
    await settingsController.getSettings(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { general: {} },
      message: 'Settings retrieved successfully',
    });
  });

  it('should handle getSettings error', async () => {
    (settingsService.getSettings as jest.Mock).mockRejectedValue(new Error('fail'));
    await settingsController.getSettings(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'fail',
    });
  });

  describe('updateSettings', () => {
    it('should return 400 if body is missing', async () => {
      req.body = undefined;
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Request body is required',
      });
    });

    it('should return 400 if body is empty', async () => {
      req.body = {};
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Request body is required',
      });
    });

    it('should handle invalid general data format', async () => {
      req.body = { general: '{invalidJson}' };
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Invalid general data format',
      });
    });

    it('should handle file upload for siteLogo', async () => {
      req.body = { general: JSON.stringify({ siteName: 'Test' }) };
      req.files = {
        siteLogo: [{
          fieldname: 'siteLogo',
          originalname: 'logo.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: 'uploads/settings/siteLogo',
          filename: 'logo.png',
          path: 'uploads/settings/siteLogo/logo.png',
          size: 1234,
          buffer: Buffer.from(''),
          stream: {} as any
        }],
      };
      (settingsService.updateSettings as jest.Mock).mockResolvedValue({ general: { siteLogo: 'uploads/settings/siteLogo/logo.png' } });
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Settings updated successfully',
        data: { general: { siteLogo: 'uploads/settings/siteLogo/logo.png' } },
      });
    });

    it('should handle file upload for favicon', async () => {
      req.body = { general: JSON.stringify({ siteName: 'Test' }) };
      req.files = {
        favicon: [{
          fieldname: 'favicon',
          originalname: 'favicon.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: 'uploads/settings/favicon',
          filename: 'favicon.png',
          path: 'uploads/settings/favicon/favicon.png',
          size: 567,
          buffer: Buffer.from(''),
          stream: {} as any
        }],
      };
      (settingsService.updateSettings as jest.Mock).mockResolvedValue({ general: { favicon: 'uploads/settings/favicon/favicon.png' } });
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Settings updated successfully',
        data: { general: { favicon: 'uploads/settings/favicon/favicon.png' } },
      });
    });

    it('should handle file upload for ogImage', async () => {
      req.body = { og: JSON.stringify({ ogTitle: 'Test' }) };
      req.files = {
        ogImage: [{
          fieldname: 'ogImage',
          originalname: 'og.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: 'uploads/settings/ogImage',
          filename: 'og.png',
          path: 'uploads/settings/ogImage/og.png',
          size: 567,
          buffer: Buffer.from(''),
          stream: {} as any
        }],
      };
      (settingsService.updateSettings as jest.Mock).mockResolvedValue({ og: { ogImage: 'uploads/settings/ogImage/og.png' } });
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Settings updated successfully',
        data: { og: { ogImage: 'uploads/settings/ogImage/og.png' } },
      });
    });

    it('should handle ValidationError', async () => {
      req.body = { general: { siteName: 'Test' } };
      const error = new Error('validation fail') as any;
      error.name = 'ValidationError';
      error.errors = { field: 'error' };
      (settingsService.updateSettings as jest.Mock).mockRejectedValue(error);
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: `Settings validation failed: validation fail`,
        errors: { field: 'error' },
      });
    });

    it('should handle CastError', async () => {
      req.body = { general: { siteName: 'Test' } };
      const error = new Error('cast fail') as any;
      error.name = 'CastError';
      (settingsService.updateSettings as jest.Mock).mockRejectedValue(error);
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: `Invalid data format: cast fail`,
      });
    });

    it('should handle generic error', async () => {
      req.body = { general: { siteName: 'Test' } };
      const error = new Error('generic fail') as any;
      (settingsService.updateSettings as jest.Mock).mockRejectedValue(error);
      await settingsController.updateSettings(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'generic fail',
      });
    });
  });
});
