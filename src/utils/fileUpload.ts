/* istanbul ignore file */
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/* istanbul ignore next */
interface MulterRequest {
  body: {
    managementName?: string;
    [key: string]: any;
  };
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
};

interface FilenameRequest {
  body: {
    managementName?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface FilenameFile {
  originalname: string;
  fieldname: string;
  mimetype: string;
  [key: string]: any;
}

type FilenameCallback = (error: Error | null, filename: string) => void;

export const filename = (req: FilenameRequest, file: FilenameFile, cb: FilenameCallback): void => {
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