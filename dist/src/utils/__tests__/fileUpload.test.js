"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fileUpload_1 = require("../fileUpload");
describe('fileUpload utility', () => {
    describe('destination', () => {
        it('should create correct folder path and call cb with path', (done) => {
            const req = { managementName: 'settings' };
            const file = { fieldname: 'siteLogo', originalname: 'logo.png' };
            const cb = (err, folderPath) => {
                expect(err).toBeNull();
                expect(folderPath).toContain(path_1.default.join('uploads', 'settings', 'siteLogo'));
                done();
            };
            (0, fileUpload_1.destination)(req, file, cb);
        });
        it('should sanitize managementName and create folder', (done) => {
            const req = { managementName: 'set@tings!#' };
            const file = { fieldname: 'favicon', originalname: 'favicon.ico' };
            const cb = (err, folderPath) => {
                expect(err).toBeNull();
                expect(folderPath).toContain(path_1.default.join('uploads', 'settings', 'favicon'));
                done();
            };
            (0, fileUpload_1.destination)(req, file, cb);
        });
    });
    describe('filename', () => {
        it('should generate a filename with timestamp and random number', () => {
            const req = {};
            const file = { originalname: 'logo.png' };
            const cb = jest.fn();
            (0, fileUpload_1.filename)(req, file, cb);
            expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/\d+_\d+\.png$/));
        });
    });
    describe('fileFilterFunc', () => {
        it('should accept allowed file types', () => {
            const req = {};
            const file = { mimetype: 'image/png' };
            const cb = jest.fn();
            (0, fileUpload_1.fileFilterFunc)(req, file, cb);
            expect(cb).toHaveBeenCalledWith(null, true);
        });
        it('should reject disallowed file types', () => {
            const req = {};
            const file = { mimetype: 'application/exe' };
            const cb = jest.fn();
            (0, fileUpload_1.fileFilterFunc)(req, file, cb);
            expect(cb).toHaveBeenCalledWith(null, false);
        });
    });
});
