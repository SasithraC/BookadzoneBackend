"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTemplateFile = writeTemplateFile;
exports.updateTemplateFile = updateTemplateFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TEMPLATE_FOLDER = path_1.default.join(__dirname, "..", "templates");
function ensureTemplateFolderExists() {
    if (!fs_1.default.existsSync(TEMPLATE_FOLDER)) {
        fs_1.default.mkdirSync(TEMPLATE_FOLDER, { recursive: true });
    }
}
function writeTemplateFile(slug, content) {
    ensureTemplateFolderExists();
    const filePath = path_1.default.join(TEMPLATE_FOLDER, `${slug}.html`);
    fs_1.default.writeFileSync(filePath, content, "utf8");
    return filePath; // return path
}
function updateTemplateFile(slug, content) {
    const filePath = path_1.default.join(TEMPLATE_FOLDER, `${slug}.html`);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, content, "utf8");
        return filePath;
    }
    else {
        throw new Error("Template file not found for update.");
    }
}
