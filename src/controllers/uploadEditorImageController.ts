import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const uploadEditorImageController = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Build the file URL (assuming static serving from /uploads)
  const fileUrl = `/uploads/${req.file.path.replace(/\\/g, "/").split("uploads/")[1]}`;
  // Jodit expects { success: 1, files: [{ url }] }
  return res.status(200).json({
    success: 1,
    files: [{ url: fileUrl }],
  });
};

export const deleteEditorImageController = (req: Request, res: Response) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Remove leading slash and construct full file path
    const relativePath = imageUrl.replace(/^\//, '');
    const filePath = path.join(process.cwd(), relativePath);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      return res.status(200).json({ 
        success: true, 
        message: "Image deleted successfully" 
      });
    } else {
      return res.status(404).json({ 
        error: "Image not found" 
      });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ 
      error: "Failed to delete image" 
    });
  }
};
