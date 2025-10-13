import { Request, Response, NextFunction } from "express";
import settingsService from "../services/settingsService";

class SettingsController {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.getSettings();
      res.status(200).json({
        status: "success",
        data: settings,
        message: "Settings retrieved successfully",
      });
    } catch (err: any) {
      console.error('Controller - getSettings error:', err);
      res.status(500).json({
        status: "fail",
        message: err.message || "Failed to retrieve settings",
      });
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: "fail",
          message: "Request body is required",
        });
      }


      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updateData = { ...req.body };

  
      if (files) {
        if (files.siteLogo && files.siteLogo[0]) {
          const file = files.siteLogo[0];       
          const fileUrl = file.path.replace(/\\/g, '/');
          
    
          if (updateData.general && typeof updateData.general === 'string') {
            const generalData = JSON.parse(updateData.general);
            generalData.siteLogo = fileUrl;
            updateData.general = generalData;
          } else if (!updateData.general) {
            updateData.general = { siteLogo: fileUrl };
          } else {
            updateData.general.siteLogo = fileUrl;
          }
        }

        if (files.favicon && files.favicon[0]) {
          const file = files.favicon[0];      
          const fileUrl = file.path.replace(/\\/g, '/');
          
       
       
          if (updateData.general && typeof updateData.general === 'string') {
            const generalData = JSON.parse(updateData.general);
            generalData.favicon = fileUrl;
            updateData.general = generalData;
          } else if (!updateData.general) {
            updateData.general = { favicon: fileUrl };
          } else {
            updateData.general.favicon = fileUrl;
          }
        }
          // Handle ogImage upload
          if (files.ogImage && files.ogImage[0]) {
            const file = files.ogImage[0];
            const fileUrl = file.path.replace(/\\/g, '/');
            console.log('OG Image uploaded:', fileUrl);
            // Parse og data if it exists
            if (updateData.og && typeof updateData.og === 'string') {
              const ogData = JSON.parse(updateData.og);
              ogData.ogImage = fileUrl;
              updateData.og = ogData;
            } else if (!updateData.og) {
              updateData.og = { ogImage: fileUrl };
            } else {
              updateData.og.ogImage = fileUrl;
            }
          }
      }

  
      if (updateData.general && typeof updateData.general === 'string') {
        try {
          updateData.general = JSON.parse(updateData.general);
        } catch (parseError) {
      
          return res.status(400).json({
            status: "fail",
            message: "Invalid general data format",
          });
        }
      }


      const updated = await settingsService.updateSettings(updateData);
      res.status(200).json({
        status: "success",
        message: "Settings updated successfully",
        data: updated,
      });
    } catch (err: any) {
    
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          status: "fail",
          message: `Settings validation failed: ${err.message}`,
          errors: err.errors,
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({
          status: "fail",
          message: `Invalid data format: ${err.message}`,
        });
      }
      res.status(500).json({
        status: "fail",
        message: err.message || "Failed to update settings",
      });
    }
  }
}

export default new SettingsController();