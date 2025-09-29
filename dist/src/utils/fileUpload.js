"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilterFunc = exports.storage = exports.filename = exports.destination = void 0;
/* istanbul ignore file */
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const destination = (req, file, cb) => {
    try {
        const managementName = req.body.managementName || 'default';
        const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
        // Use relative path from project root instead of absolute path
        const folderPath = path_1.default.join('uploads', sanitizedManagementName, file.fieldname);
        // Create the directory if it doesn't exist
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
        error.statusCode = 400;
        console.log(`[MULTER] Rejected file type: ${file.mimetype}`);
        return cb(error, false);
    }
    cb(null, true);
};
exports.fileFilterFunc = fileFilterFunc;
/* istanbul ignore next */
const upload = (0, multer_1.default)({
    storage: exports.storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
    },
    fileFilter: exports.fileFilterFunc,
});
exports.default = upload;
