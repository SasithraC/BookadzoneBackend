"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const creatingFile_1 = require("../creatingFile");
describe('creatingFile', () => {
    it('writes and updates a file', () => {
        const slug = 'test-template';
        const content = "<h1>Test</h1>";
        const filePath = (0, creatingFile_1.writeTemplateFile)(slug, content);
        expect(fs_1.default.existsSync(filePath)).toBe(true);
        const updatedContent = "<h2>Updated</h2>";
        (0, creatingFile_1.updateTemplateFile)(slug, updatedContent);
        expect(fs_1.default.readFileSync(filePath, 'utf8')).toBe(updatedContent);
        // Clean up: fs.unlinkSync(filePath)
    });
    it('throws when updating missing file', () => {
        expect(() => (0, creatingFile_1.updateTemplateFile)('no-file', '<h1>Missing</h1>')).toThrow('Template file not found for update.');
    });
});
