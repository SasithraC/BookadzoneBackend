import { Request, Response } from 'express';
import { BannerService } from '../services/bannerService';
import fs from 'fs';
import path from 'path';

export class BannerController {
  private service: BannerService;
  constructor(service?: BannerService) {
    this.service = service || new BannerService();
  }
  async getAll(req: Request, res: Response) {
    try {
      const banners = await this.service.getAllBanners();
      res.json(banners);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: message });
    }
  }

  private async deleteFileFromDisk(filePath: string) {
    try {
      // Handle both relative and absolute paths
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log(`[FILE DELETION] Successfully deleted: ${fullPath}`);
      } else {
        console.log(`[FILE DELETION] File not found: ${fullPath}`);
      }
    } catch (error) {
      console.error(`[FILE DELETION] Error deleting file ${filePath}:`, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      // Log incoming request body and files for debugging
      console.log('[DEBUG] Raw req.body:', JSON.stringify(req.body, null, 2));
      console.log('[DEBUG] Raw req.files:', req.files);

      // Parse nested fields using qs
      const qs = require('qs');
      const body = qs.parse(req.body);

      // ...existing code...
      function safeParse(obj: any, key: string) {
        if (typeof obj[key] === 'string') {
          try { obj[key] = JSON.parse(obj[key]); } catch {}
        }
      }
      safeParse(body, 'homepage');
      safeParse(body, 'aboutBanner');
      // ...existing code...
      if (body.homepage && body.homepage.bannerTwo && typeof body.homepage.bannerTwo.features === 'string') {
        try { body.homepage.bannerTwo.features = JSON.parse(body.homepage.bannerTwo.features); } catch {}
      }
      // ...existing code...
      if (body.aboutBanner) {
        ['bannerOne', 'bannerTwo'].forEach(sub => {
          if (body.aboutBanner[sub]) {
            if (typeof body.aboutBanner[sub].images === 'string') {
              try { body.aboutBanner[sub].images = JSON.parse(body.aboutBanner[sub].images); } catch {}
            }
            if (typeof body.aboutBanner[sub].removedImages === 'string') {
              try { body.aboutBanner[sub].removedImages = JSON.parse(body.aboutBanner[sub].removedImages); } catch {}
            }
          }
        });
        if (body.aboutBanner.bannerFour && typeof body.aboutBanner.bannerFour === 'string') {
          try { body.aboutBanner.bannerFour = JSON.parse(body.aboutBanner.bannerFour); } catch {}
        }
        if (body.aboutBanner.bannerFour && typeof body.aboutBanner.bannerFour === 'object') {
          if (!('title' in body.aboutBanner.bannerFour)) {
            body.aboutBanner.bannerFour.title = '';
          }
          if (!Array.isArray(body.aboutBanner.bannerFour.history)) {
            body.aboutBanner.bannerFour.history = [];
          }
        }
      }

      // ...existing code...
      let filteredSubmenu1Images: { id: number; url: string }[] = [];
      let filteredSubmenu2Images: { id: number; url: string }[] = [];

      // ...existing code...
      if (body.aboutBanner) {
        for (const [index, submenuKey] of ['submenu1', 'submenu2'].entries()) {
          const submenu = body.aboutBanner[submenuKey];
          if (submenu && submenu.removedImages && Array.isArray(submenu.removedImages)) {
            console.log(`[FILE REMOVAL] Processing removed images for ${submenuKey}:`, submenu.removedImages);
            for (const removedFile of submenu.removedImages) {
              if (typeof removedFile === 'string' && removedFile.trim() !== '') {
                await this.deleteFileFromDisk(removedFile);
              }
            }
            const banners = await this.service.getAllBanners();
            const currentBanner = Array.isArray(banners) ? banners[0] : banners;
            let filteredImages: { id: number; url: string }[] = [];
            if (currentBanner?.aboutBanner?.[submenuKey]?.images) {
              const currentImages = currentBanner.aboutBanner[submenuKey].images;
              filteredImages = currentImages.filter((img: any) => {
                if (typeof img === 'object' && img.url) {
                  return !submenu.removedImages.includes(img.url);
                }
                return true;
              });
            }
            if (index === 0) {
              filteredSubmenu1Images = filteredImages;
            } else {
              filteredSubmenu2Images = filteredImages;
            }
            submenu.images = filteredImages;
            delete submenu.removedImages;
          } else {
            const banners = await this.service.getAllBanners();
            const currentBanner = Array.isArray(banners) ? banners[0] : banners;
            if (currentBanner?.aboutBanner?.[submenuKey]?.images) {
              if (index === 0) {
                filteredSubmenu1Images = currentBanner.aboutBanner[submenuKey].images;
              } else {
                filteredSubmenu2Images = currentBanner.aboutBanner[submenuKey].images;
              }
            }
          }
        }
      }

      // ...existing code...
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files['homepage.bannerOne.image1']) {
          body.homepage = { ...body.homepage, bannerOne: { ...body.homepage?.bannerOne, image1: files['homepage.bannerOne.image1'][0].path } };
        }
        if (files['homepage.bannerOne.image2']) {
          body.homepage = { ...body.homepage, bannerOne: { ...body.homepage?.bannerOne, image2: files['homepage.bannerOne.image2'][0].path } };
        }
        if (files['homepage.bannerOne.image3']) {
          body.homepage = { ...body.homepage, bannerOne: { ...body.homepage?.bannerOne, image3: files['homepage.bannerOne.image3'][0].path } };
        }
        if (files['homepage.bannerTwo.backgroundImage']) {
          body.homepage = { ...body.homepage, bannerTwo: { ...body.homepage?.bannerTwo, backgroundImage: files['homepage.bannerTwo.backgroundImage'][0].path } };
        }
        if (files['aboutBanner.bannerOne.backgroundImage']) {
          body.aboutBanner = { ...body.aboutBanner, bannerOne: { ...body.aboutBanner?.bannerOne, backgroundImage: files['aboutBanner.bannerOne.backgroundImage'][0].path } };
        }
        if (files['aboutBanner.bannerTwo.backgroundImage']) {
          body.aboutBanner = { ...body.aboutBanner, bannerTwo: { ...body.aboutBanner?.bannerTwo, backgroundImage: files['aboutBanner.bannerTwo.backgroundImage'][0].path } };
        }
        if (files['aboutBanner.bannerOne.images']) {
          const newImagePaths = files['aboutBanner.bannerOne.images'].map((f, idx) => ({ id: Date.now() + idx, url: f.path }));
          const combinedImages = [...filteredSubmenu1Images, ...newImagePaths];
          body.aboutBanner = {
            ...body.aboutBanner,
            bannerOne: {
              ...body.aboutBanner?.bannerOne,
              images: combinedImages
            }
          };
        }
        if (files['aboutBanner.bannerTwo.images']) {
          const newImagePaths = files['aboutBanner.bannerTwo.images'].map((f, idx) => ({ id: Date.now() + idx, url: f.path }));
          const combinedImages = [...filteredSubmenu2Images, ...newImagePaths];
          body.aboutBanner = {
            ...body.aboutBanner,
            bannerTwo: {
              ...body.aboutBanner?.bannerTwo,
              images: combinedImages
            }
          };
        }
      }

      console.log('[DEBUG] Final body data before update:', JSON.stringify(body, null, 2));

      const banner = await this.service.updateBanner(body);
      res.json(banner);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: message });
    }
  }
}