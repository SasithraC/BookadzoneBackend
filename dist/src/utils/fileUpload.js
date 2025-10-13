"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileFilterFunc = exports.storage = exports.filename = exports.destination = void 0;
/* istanbul ignore file */
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const destination = (req, file, cb) => {
    try {
        const managementName = req.managementName || 'default';
        const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
        const folderPath = path_1.default.join('uploads', sanitizedManagementName, 'logo');
        fs_1.default.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    }
    catch (err) {
        cb(err, '');
    }
};
exports.destination = destination;
const filename = (req, file, cb) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 99999);
    const ext = path_1.default.extname(file.originalname);
    const newFilename = `${timestamp}_${randomNum}${ext}`;
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
