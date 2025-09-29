import { Request, Response } from "express";
import path from "path";

export const uploadEditorImageController = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Build the file URL (assuming static serving from /uploads)
  const fileUrl = `/uploads/${req.file.path.replace(/\\/g, "/").split("uploads/")[1]}`;
  return res.status(200).json({
    success: 1,
    data: { files: [{ url: fileUrl }] },
  });
};
