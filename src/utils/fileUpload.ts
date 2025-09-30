/* istanbul ignore file */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

/* istanbul ignore next */
interface MulterRequest extends Request {
  managementName?: string;
  [key: string]: any;
}

interface MulterFile {
  originalname: string;
  fieldname: string;
  mimetype: string;
  [key: string]: any;
}

type MulterCallback = (error: Error | null, destination: string) => void;

export const destination = (req: MulterRequest, file: MulterFile, cb: MulterCallback): void => {
  try {
    // Expect fieldname like 'homepage.bannerOne.image1'
    const managementName = req.managementName || 'default';
    const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
    let folderPath = path.join('uploads', sanitizedManagementName);
    if (file.fieldname) {
      // Split by dot and create nested folders
      const fieldParts = file.fieldname.split('.');
      for (const part of fieldParts) {
        const sanitizedPart = part.replace(/[^a-zA-Z0-9-_]/g, '');
        folderPath = path.join(folderPath, sanitizedPart);
      }
    }
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`[MULTER] Saving file ${file.originalname} to: ${folderPath}`);
    cb(null, folderPath);
  } catch (err) {
    console.error('[MULTER] Error creating upload folder:', err);
    cb(err as Error, '');
  }
};
// Helper to delete previous file if exists
export const deletePreviousFile = (managementName: string, imageName: string, filename: string): boolean => {
  const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
  const sanitizedImageName = imageName.replace(/[^a-zA-Z0-9-_]/g, '');
  const filePath = path.join('uploads', sanitizedManagementName, sanitizedImageName, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`[MULTER] Deleted previous file: ${filePath}`);
      return true;
    } catch (err) {
      console.error(`[MULTER] Error deleting previous file: ${filePath}`, err);
      return false;
    }
  }
  return false;
};

export const filename = (req: MulterRequest, file: MulterFile, cb: (error: Error | null, filename: string) => void): void => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 99999);
  const ext = path.extname(file.originalname);
  const newFilename = `${timestamp}_${randomNum}${ext}`;
  console.log(`[MULTER] Saving file as: ${newFilename}`);
  cb(null, newFilename);
};

export const storage = multer.diskStorage({
  destination,
  filename,
});

export const fileFilterFunc = (req: MulterRequest, file: MulterFile, cb: multer.FileFilterCallback): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Only jpg, png, webp, and pdf files are allowed');
    console.log(`[MULTER] Rejected file type: ${file.mimetype}`);
    return cb(null, false);
  }
  cb(null, true);
};

/* istanbul ignore next */
export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: fileFilterFunc,
});