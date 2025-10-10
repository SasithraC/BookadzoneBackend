"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileFilterFunc = exports.storage = exports.filename = exports.deletePreviousFile = exports.destination = void 0;
/* istanbul ignore file */
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const destination = (req, file, cb) => {
    try {
        // Expect fieldname like 'homepage.bannerOne.image1'
        const managementName = req.managementName || 'default';
        const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
        let folderPath = path_1.default.join('uploads', sanitizedManagementName);
        if (file.fieldname) {
            // Split by dot and create nested folders
            const fieldParts = file.fieldname.split('.');
            for (const part of fieldParts) {
                const sanitizedPart = part.replace(/[^a-zA-Z0-9-_]/g, '');
                folderPath = path_1.default.join(folderPath, sanitizedPart);
            }
        }
        fs_1.default.mkdirSync(folderPath, { recursive: true });
        console.log(`[MULTER] Saving file ${file.originalname} to: ${folderPath}`);
        cb(null, folderPath);
    }
    catch (err) {
        console.error('[MULTER] Error creating upload folder:', err);
        cb(err, '');
    }
};
exports.destination = destination;
// Helper to delete previous file if exists
const deletePreviousFile = (managementName, imageName, filename) => {
    const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
    const sanitizedImageName = imageName.replace(/[^a-zA-Z0-9-_]/g, '');
    const filePath = path_1.default.join('uploads', sanitizedManagementName, sanitizedImageName, filename);
    if (fs_1.default.existsSync(filePath)) {
        try {
            fs_1.default.unlinkSync(filePath);
            console.log(`[MULTER] Deleted previous file: ${filePath}`);
            return true;
        }
        catch (err) {
            console.error(`[MULTER] Error deleting previous file: ${filePath}`, err);
            return false;
        }
    }
    return false;
};
exports.deletePreviousFile = deletePreviousFile;
const filename = (req, file, cb) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 99999);
    const ext = path_1.default.extname(file.originalname);
    const newFilename = `${timestamp}_${randomNum}${ext}`;
    console.log(`[MULTER] Saving file as: ${newFilename}`);
    cb(null, newFilename);
};
exports.filename = filename;
exports.storage = multer_1.default.diskStorage({
    destination: exports.destination,
    filename: exports.filename,
});
const fileFilterFunc = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Only jpg, png, webp, and pdf files are allowed');
        console.log(`[MULTER] Rejected file type: ${file.mimetype}`);
        return cb(null, false);
    }
    cb(null, true);
};
exports.fileFilterFunc = fileFilterFunc;
/* istanbul ignore next */
exports.upload = (0, multer_1.default)({
    storage: exports.storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
    },
    fileFilter: exports.fileFilterFunc,
});
