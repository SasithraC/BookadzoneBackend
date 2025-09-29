import { Request, Response } from 'express';

jest.mock('../../services/bannerService');
import { BannerController } from '../../controllers/bannerController';
import { BannerService } from '../../services/bannerService';

describe('BannerController', () => {
  let controller: BannerController;
  let mockService: jest.Mocked<BannerService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockService = new BannerService() as jest.Mocked<BannerService>;
    controller = new BannerController(mockService);
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getAll', () => {
    it('should return banners', async () => {
      const mockBanner: Partial<import('../../models/bannerModel').IBanner> = { adminId: '01' };
      mockService.getAllBanners.mockResolvedValue(mockBanner as any);
      await controller.getAll(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith(mockBanner);
    });
    it('should handle error', async () => {
      mockService.getAllBanners.mockRejectedValue(new Error('fail'));
      await controller.getAll(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    });
  });

  describe('update', () => {
    it('should update and return banner', async () => {
      req.body = { homepage: {} };
      req.files = {};
      const mockBanner: Partial<import('../../models/bannerModel').IBanner> = { adminId: '01' };
      mockService.updateBanner.mockResolvedValue(mockBanner as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith(mockBanner);
    });
    it('should handle error', async () => {
      req.body = { homepage: {} };
      req.files = {};
      mockService.updateBanner.mockRejectedValue(new Error('fail'));
      await controller.update(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    });

    it('should handle homepage.bannerTwo.features as string', async () => {
      req.body = {
        homepage: {
          bannerTwo: {
            features: JSON.stringify([{ icon: 'icon.png', title: 'Feature' }])
          }
        }
      };
      req.files = {};
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle aboutBanner.bannerFour as string', async () => {
      req.body = {
        aboutBanner: {
          bannerFour: JSON.stringify({ title: 'Banner Four', history: [] })
        }
      };
      req.files = {};
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle aboutBanner.bannerFour missing title/history', async () => {
      req.body = {
        aboutBanner: {
          bannerFour: {}
        }
      };
      req.files = {};
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for homepage.bannerOne.image1', async () => {
      req.body = { homepage: { bannerOne: {} } };
      req.files = { 'homepage.bannerOne.image1': [{
        fieldname: 'homepage.bannerOne.image1',
        originalname: 'img1.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'img1.jpg',
        path: 'uploads/img1.jpg',
        size: 123,
        buffer: Buffer.from(''),
        stream: {} as any
      }] };
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for homepage.bannerOne.image2', async () => {
      req.body = { homepage: { bannerOne: {} } };
      req.files = { 'homepage.bannerOne.image2': [{
        fieldname: 'homepage.bannerOne.image2',
        originalname: 'img2.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'img2.jpg',
        path: 'uploads/img2.jpg',
        size: 123,
        buffer: Buffer.from(''),
        stream: {} as any
      }] };
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for homepage.bannerOne.image3', async () => {
      req.body = { homepage: { bannerOne: {} } };
      req.files = { 'homepage.bannerOne.image3': [{
        fieldname: 'homepage.bannerOne.image3',
        originalname: 'img3.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'img3.jpg',
        path: 'uploads/img3.jpg',
        size: 123,
        buffer: Buffer.from(''),
        stream: {} as any
      }] };
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for homepage.bannerTwo.backgroundImage', async () => {
      req.body = { homepage: { bannerTwo: {} } };
      req.files = { 'homepage.bannerTwo.backgroundImage': [{
        fieldname: 'homepage.bannerTwo.backgroundImage',
        originalname: 'bg.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'bg.jpg',
        path: 'uploads/bg.jpg',
        size: 123,
        buffer: Buffer.from(''),
        stream: {} as any
      }] };
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for aboutBanner.bannerOne.backgroundImage', async () => {
      req.body = { aboutBanner: { bannerOne: {} } };
      req.files = { 'aboutBanner.bannerOne.backgroundImage': [{
        fieldname: 'aboutBanner.bannerOne.backgroundImage',
        originalname: 'bg1.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'bg1.jpg',
        path: 'uploads/bg1.jpg',
        size: 123,
        buffer: Buffer.from(''),
        stream: {} as any
      }] };
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for aboutBanner.bannerTwo.backgroundImage', async () => {
      req.body = { aboutBanner: { bannerTwo: {} } };
      req.files = { 'aboutBanner.bannerTwo.backgroundImage': [{
        fieldname: 'aboutBanner.bannerTwo.backgroundImage',
        originalname: 'bg2.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'bg2.jpg',
        path: 'uploads/bg2.jpg',
        size: 123,
        buffer: Buffer.from(''),
        stream: {} as any
      }] };
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for aboutBanner.bannerOne.images', async () => {
      req.body = { aboutBanner: { bannerOne: { images: [] } } };
      req.files = { 'aboutBanner.bannerOne.images': [
        {
          fieldname: 'aboutBanner.bannerOne.images',
          originalname: 'img1.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: 'uploads/',
          filename: 'img1.jpg',
          path: 'uploads/img1.jpg',
          size: 123,
          buffer: Buffer.from(''),
          stream: {} as any
        },
        {
          fieldname: 'aboutBanner.bannerOne.images',
          originalname: 'img2.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: 'uploads/',
          filename: 'img2.jpg',
          path: 'uploads/img2.jpg',
          size: 123,
          buffer: Buffer.from(''),
          stream: {} as any
        }
      ] };
      mockService.getAllBanners.mockResolvedValue({ aboutBanner: { bannerOne: { images: [] } } } as any);
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload for aboutBanner.bannerTwo.images', async () => {
      req.body = { aboutBanner: { bannerTwo: { images: [] } } };
      req.files = { 'aboutBanner.bannerTwo.images': [{
        fieldname: 'aboutBanner.bannerTwo.images',
        originalname: 'img3.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'img3.jpg',
        path: 'uploads/img3.jpg',
        size: 123,
        buffer: Buffer.from(''),
        stream: {} as any
      }] };
      mockService.getAllBanners.mockResolvedValue({ aboutBanner: { bannerTwo: { images: [] } } } as any);
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });
  });

  describe('deleteFileFromDisk', () => {
    it('should log file not found', async () => {
      const controllerInstance = new BannerController(mockService);
      const spyExistsSync = jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
      const spyConsole = jest.spyOn(console, 'log').mockImplementation(() => {});
      await (controllerInstance as any).deleteFileFromDisk('fakepath');
      expect(spyConsole).toHaveBeenCalledWith(expect.stringContaining('File not found'));
      spyExistsSync.mockRestore();
      spyConsole.mockRestore();
    });

    it('should handle error during file deletion', async () => {
      const controllerInstance = new BannerController(mockService);
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest.spyOn(require('fs').promises, 'unlink').mockRejectedValue(new Error('fail'));
      const spyConsole = jest.spyOn(console, 'error').mockImplementation(() => {});
      await (controllerInstance as any).deleteFileFromDisk('fakepath');
      expect(spyConsole.mock.calls[0][0]).toContain('Error deleting file');
      expect(spyConsole.mock.calls[0][1]).toBeInstanceOf(Error);
      spyConsole.mockRestore();
    });

    it('should log successful file deletion', async () => {
      const controllerInstance = new BannerController(mockService);
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest.spyOn(require('fs').promises, 'unlink').mockResolvedValue(undefined);
      const spyConsole = jest.spyOn(console, 'log').mockImplementation(() => {});
      await (controllerInstance as any).deleteFileFromDisk('fakepath');
      expect(spyConsole).toHaveBeenCalledWith(expect.stringContaining('Successfully deleted'));
      spyConsole.mockRestore();
    });

    it('should delete file if absolute path', async () => {
      const controllerInstance = new BannerController(mockService);
      jest.spyOn(require('path'), 'isAbsolute').mockReturnValue(true);
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest.spyOn(require('fs').promises, 'unlink').mockResolvedValue(undefined);
      const spyConsole = jest.spyOn(console, 'log').mockImplementation(() => {});
      await (controllerInstance as any).deleteFileFromDisk('C:/absolute/path/file.txt');
      expect(spyConsole).toHaveBeenCalledWith(expect.stringContaining('Successfully deleted'));
      spyConsole.mockRestore();
    });
  });

  describe('update edge cases', () => {
    it('should handle removedImages as string', async () => {
      req.body = {
        aboutBanner: {
          submenu1: {
            removedImages: JSON.stringify(['img1.jpg'])
          },
          submenu2: {}
        }
      };
      req.files = {};
      // Simulate file deletion and filtering
      jest.spyOn(BannerController.prototype as any, 'deleteFileFromDisk').mockResolvedValue(undefined);
      mockService.getAllBanners.mockResolvedValue({ aboutBanner: { submenu1: { images: [{ id: 1, url: 'img1.jpg' }, { id: 2, url: 'img2.jpg' }] }, submenu2: { images: [] } } } as any);
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
      // submenu1.images should be filtered to remove 'img1.jpg'
    });

    it('should handle removedImages as array and filter images', async () => {
      req.body = {
        aboutBanner: {
          submenu1: {
            removedImages: ['img1.jpg']
          },
          submenu2: {}
        }
      };
      req.files = {};
      jest.spyOn(BannerController.prototype as any, 'deleteFileFromDisk').mockResolvedValue(undefined);
      mockService.getAllBanners.mockResolvedValue({ aboutBanner: { submenu1: { images: [{ id: 1, url: 'img1.jpg' }, { id: 2, url: 'img2.jpg' }] }, submenu2: { images: [] } } } as any);
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
      // submenu1.images should be filtered to remove 'img1.jpg'
    });

    it('should handle images as string', async () => {
      req.body = {
        aboutBanner: {
          submenu1: {
            images: JSON.stringify([{ id: 1, url: 'img1.jpg' }])
          },
          submenu2: {}
        }
      };
      req.files = {};
      mockService.getAllBanners.mockResolvedValue({ aboutBanner: { submenu1: { images: [{ id: 1, url: 'img1.jpg' }] }, submenu2: { images: [] } } } as any);
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle error in update', async () => {
      req.body = { homepage: {} };
      req.files = {};
      mockService.updateBanner.mockRejectedValue(new Error('fail'));
      await controller.update(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    });
  });

  describe('bannerController edge cases', () => {
    it('should handle missing aboutBanner gracefully', async () => {
      req.body = {};
      req.files = {};
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle removedImages not array', async () => {
      req.body = {
        aboutBanner: {
          submenu1: {
            removedImages: 'not-an-array'
          },
          submenu2: {}
        }
      };
      req.files = {};
      mockService.getAllBanners.mockResolvedValue({ aboutBanner: { submenu1: { images: [{ id: 1, url: 'img1.jpg' }] }, submenu2: { images: [] } } } as any);
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle images not array', async () => {
      req.body = {
        aboutBanner: {
          submenu1: {
            images: 'not-an-array'
          },
          submenu2: {}
        }
      };
      req.files = {};
      mockService.getAllBanners.mockResolvedValue({ aboutBanner: { submenu1: { images: [{ id: 1, url: 'img1.jpg' }] }, submenu2: { images: [] } } } as any);
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle file upload fields missing', async () => {
      req.body = { homepage: {}, aboutBanner: { submenu1: {}, submenu2: {} } };
      req.files = {};
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });

    it('should handle JSON parse error', async () => {
      req.body = { homepage: '{badjson}', aboutBanner: '{badjson}' };
      req.files = {};
      mockService.updateBanner.mockResolvedValue({ adminId: '01' } as any);
      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ adminId: '01' });
    });
  });
});
