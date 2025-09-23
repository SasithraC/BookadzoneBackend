/* istanbul ignore file */
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/* istanbul ignore next */
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const managementName = req.body.managementName || 'default';
      const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
      
      // Use relative path from project root instead of absolute path
      const folderPath = path.join('uploads', sanitizedManagementName, file.fieldname);
      
      // Create the directory if it doesn't exist
      fs.mkdirSync(folderPath, { recursive: true });
      
      console.log(`[MULTER] Saving file ${file.originalname} to: ${folderPath}`);
      cb(null, folderPath);
    } catch (err) {
      console.error('[MULTER] Error creating upload folder:', err);
      cb(err as Error, '');
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 99999);
    const ext = path.extname(file.originalname);
    const newFilename = `${timestamp}_${randomNum}${ext}`;
    console.log(`[MULTER] Saving file as: ${newFilename}`);
    cb(null, newFilename);
  },
});

export const fileFilterFunc = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error: any = new Error('Only jpg, png, webp, and pdf files are allowed');
    error.statusCode = 400;
    console.log(`[MULTER] Rejected file type: ${file.mimetype}`);
    return cb(error, false);
  }
  cb(null, true);
};

/* istanbul ignore next */
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: fileFilterFunc,
});

export default upload;