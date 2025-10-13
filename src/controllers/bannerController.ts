import { Request, Response } from 'express';
import { BannerService } from '../services/bannerService';
import { ImageHandler, ImageFile, ProcessedImage } from '../utils/imageHandler';

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

  private processBannerImages(
    body: any, 
    bannerKey: 'bannerOne' | 'bannerTwo',
    existingFiles: ImageFile[],
    removedFiles: string[],
    newFiles?: Express.Multer.File[]
  ): ProcessedImage[] {
    console.log(`[IMAGE PROCESSING] Processing ${bannerKey} images:`);
    console.log('Existing files:', existingFiles);
    console.log('Removed files:', removedFiles);
    console.log('New files:', newFiles?.map(f => f.originalname));

    return ImageHandler.processImages(existingFiles, removedFiles, newFiles);
  }

  async update(req: Request, res: Response) {
    const uploadedNewFiles: Express.Multer.File[] = []; // Track all newly uploaded files for rollback
    const filesToDeleteAfterSuccess: string[] = []; // Track files to delete after successful save

    try {
      console.log('[DEBUG] Raw req.body:', JSON.stringify(req.body, null, 2));
      console.log('[DEBUG] Raw req.files:', req.files);

      let body = { ...req.body };

      // Parse JSON strings
      function safeParse(obj: any, key: string) {
        if (typeof obj[key] === 'string') {
          try { obj[key] = JSON.parse(obj[key]); } catch {}
        }
      }

      safeParse(body, 'homepage');
      safeParse(body, 'aboutBanner');

      if (body.homepage && body.homepage.bannerTwo && typeof body.homepage.bannerTwo.features === 'string') {
        try { body.homepage.bannerTwo.features = JSON.parse(body.homepage.bannerTwo.features); } catch {}
      }

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

      // Restructure flat body to nested structure
      const restructuredBody: any = {};
      Object.keys(body).forEach(key => {
        const parts = key.split('.');
        let current = restructuredBody;
        
        parts.forEach((part, index) => {
          if (index === parts.length - 1) {
            current[part] = body[key];
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        });
      });

      body = restructuredBody;

      if (body.aboutBanner) {
        ['bannerOne', 'bannerTwo'].forEach(section => {
          if (body.aboutBanner[section]) {
            console.log(`Processing ${section} data before parsing:`, {
              existingImages: body.aboutBanner[section].existingImages,
              removedImages: body.aboutBanner[section].removedImages
            });

            // Parse existing images
            if (typeof body.aboutBanner[section].existingImages === 'string') {
              try {
                const parsed = JSON.parse(body.aboutBanner[section].existingImages);
                console.log(`Parsed existing images for ${section}:`, parsed);
                body.aboutBanner[section].existingImages = parsed;
              } catch (e) {
                console.error(`Error parsing existingImages for ${section}:`, e);
                body.aboutBanner[section].existingImages = [];
              }
            }

            // Parse removed images
            if (typeof body.aboutBanner[section].removedImages === 'string') {
              try {
                const parsed = JSON.parse(body.aboutBanner[section].removedImages);
                console.log(`Parsed removed images for ${section}:`, parsed);
                body.aboutBanner[section].removedImages = parsed;
              } catch (e) {
                console.error(`Error parsing removedImages for ${section}:`, e);
                body.aboutBanner[section].removedImages = [];
              }
            }

            // Ensure arrays are properly initialized
            if (!Array.isArray(body.aboutBanner[section].existingImages)) {
              body.aboutBanner[section].existingImages = [];
            }
            if (!Array.isArray(body.aboutBanner[section].removedImages)) {
              body.aboutBanner[section].removedImages = [];
            }

            // Handle backgroundImageUrl if present
            if (body.aboutBanner[section].backgroundImageUrl) {
              body.aboutBanner[section].backgroundImage = body.aboutBanner[section].backgroundImageUrl;
              delete body.aboutBanner[section].backgroundImageUrl;
            }
          }
        });
      }

      // Handle file uploads
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Handle background images
        const backgroundImageFields = [
          'homepage.bannerOne.image1',
          'homepage.bannerOne.image2',
          'homepage.bannerOne.image3',
          'homepage.bannerTwo.backgroundImage',
          'aboutBanner.bannerOne.backgroundImage',
          'aboutBanner.bannerTwo.backgroundImage'
        ];

        backgroundImageFields.forEach(field => {
          if (files[field]?.[0]) {
            uploadedNewFiles.push(files[field][0]); // Track for rollback
            const pathParts = field.split('.');
            let current = body;
            for (let i = 0; i < pathParts.length - 1; i++) {
              if (!current[pathParts[i]]) current[pathParts[i]] = {};
              current = current[pathParts[i]];
            }
            current[pathParts[pathParts.length - 1]] = files[field][0].path;
          }
        });

        // Handle banner image collections
        for (const section of ['bannerOne', 'bannerTwo']) {
          if (!body.aboutBanner?.[section]) {
            continue;
          }

          const newImagesField = `aboutBanner.${section}.newImages`;
          
          if (!body.aboutBanner[section].images) {
            body.aboutBanner[section].images = [];
          }

          let existingImages = [];
          if (body.aboutBanner[section].existingImages) {
            existingImages = Array.isArray(body.aboutBanner[section].existingImages)
              ? body.aboutBanner[section].existingImages
              : typeof body.aboutBanner[section].existingImages === 'string'
                ? JSON.parse(body.aboutBanner[section].existingImages)
                : [];
          }

          let removedImages = [];
          if (body.aboutBanner[section].removedImages) {
            removedImages = Array.isArray(body.aboutBanner[section].removedImages)
              ? body.aboutBanner[section].removedImages
              : typeof body.aboutBanner[section].removedImages === 'string'
                ? JSON.parse(body.aboutBanner[section].removedImages)
                : [];
          }

          const newFiles = files[newImagesField];

          // Track new files for potential rollback
          if (newFiles && newFiles.length > 0) {
            uploadedNewFiles.push(...newFiles);
          }

          console.log(`Processing ${section}:`, {
            existingImagesCount: existingImages.length,
            removedImagesCount: removedImages.length,
            newFilesCount: newFiles?.length || 0
          });

          // Add removed files to deletion list (to be deleted AFTER successful save)
          if (Array.isArray(removedImages) && removedImages.length > 0) {
            console.log(`[${section}] Marking files for deletion:`, removedImages);
            filesToDeleteAfterSuccess.push(...removedImages.filter(f => f && typeof f === 'string'));
          }

          // Process and combine images
          console.log('Processing images for section:', section);
          console.log('Existing images before processing:', existingImages);
          
          const combinedImages = this.processBannerImages(
            body,
            section as 'bannerOne' | 'bannerTwo',
            existingImages,
            removedImages,
            newFiles
          );

          console.log('Combined images after processing:', combinedImages);

          // Validate that we have at least one image (if this is a required field)
          // Uncomment if you want to enforce minimum images
          // if (!ImageHandler.validateImageArray(combinedImages, 1)) {
          //   throw new Error(`${section} must have at least one image`);
          // }

          // Process and merge all images
          const processedImages = combinedImages.map(img => {
            const processedImage: ProcessedImage = {
              id: img.id || Date.now() + Math.floor(Math.random() * 1000),
              url: img.url.replace(/\\/g, '/')
            };
            if ('_id' in img && img._id) {
              processedImage._id = img._id;
            }
            return processedImage;
          });

          // Update the section's images
          body.aboutBanner[section].images = processedImages;

          console.log(`Final ${section} processed images:`, processedImages);
          
          // Handle background image if it exists
          if (body.aboutBanner[section].backgroundImageUrl) {
            body.aboutBanner[section].backgroundImage = 
              body.aboutBanner[section].backgroundImageUrl.replace(/\\/g, '/');
          }

          console.log(`Final ${section} images:`, body.aboutBanner[section].images);

          // Clean up temporary fields
          if (body.aboutBanner?.[section]) {
            delete body.aboutBanner[section].existingImages;
            delete body.aboutBanner[section].removedImages;
            delete body.aboutBanner[section].backgroundImageUrl;
          }
        }
      }

      // Log the final state before update
      console.log('[DEBUG] Final body data before update:', JSON.stringify(body, null, 2));

      // SAVE TO DATABASE FIRST
      const banner = await this.service.updateBanner(body);

      // ONLY delete removed files AFTER successful database save
      if (filesToDeleteAfterSuccess.length > 0) {
        console.log('[FILE CLEANUP] Deleting removed files after successful save:', filesToDeleteAfterSuccess);
        await ImageHandler.deleteMultipleFiles(filesToDeleteAfterSuccess);
      }

      res.json(banner);
    } catch (error) {
      console.error('[BANNER UPDATE ERROR]', error);

      // ROLLBACK: Delete newly uploaded files if database save failed
      if (uploadedNewFiles.length > 0) {
        console.log('[ROLLBACK] Deleting newly uploaded files due to error');
        await ImageHandler.rollbackNewFiles(uploadedNewFiles);
      }

      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: message });
    }
  }
}