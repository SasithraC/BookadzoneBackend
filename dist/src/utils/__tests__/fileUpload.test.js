"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fileUpload_1 = require("../fileUpload");
describe('fileUpload utils', () => {
    describe('destination', () => {
        it('should create folder and call cb with path', () => {
            const req = { body: { managementName: 'test' } };
            const file = { originalname: 'file.txt', fieldname: 'docs', mimetype: 'text/plain' };
            const cb = jest.fn();
            jest.spyOn(fs_1.default, 'mkdirSync').mockImplementation(() => path_1.default.join('uploads', 'test', 'docs'));
            jest.spyOn(console, 'log').mockImplementation(() => { });
            (0, fileUpload_1.destination)(req, file, cb);
            expect(fs_1.default.mkdirSync).toHaveBeenCalledWith(path_1.default.join('uploads', 'test', 'docs'), { recursive: true });
            expect(cb).toHaveBeenCalledWith(null, path_1.default.join('uploads', 'test', 'docs'));
        });
        it('should handle error and call cb with error', () => {
            const req = { body: { managementName: 'test' } };
            const file = { originalname: 'file.txt', fieldname: 'docs', mimetype: 'text/plain' };
            const cb = jest.fn();
            jest.spyOn(fs_1.default, 'mkdirSync').mockImplementation(() => { throw new Error('fail'); });
            jest.spyOn(console, 'error').mockImplementation(() => { });
            (0, fileUpload_1.destination)(req, file, cb);
            expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
            expect(cb.mock.calls[0][1]).toBe('');
        });
    });
    describe('filename', () => {
        it('should generate filename and call cb', () => {
            const req = { body: {} };
            const file = { originalname: 'file.pdf', fieldname: 'docs', mimetype: 'application/pdf' };
            const cb = jest.fn();
            jest.spyOn(console, 'log').mockImplementation(() => { });
            (0, fileUpload_1.filename)(req, file, cb);
            expect(cb.mock.calls[0][0]).toBeNull();
            expect(cb.mock.calls[0][1]).toMatch(/\d+_\d+\.pdf/);
        });
    });
    describe('fileFilterFunc', () => {
        it('should accept allowed mimetype', () => {
            const cb = jest.fn();
            (0, fileUpload_1.fileFilterFunc)({}, { mimetype: 'image/png' }, cb);
            expect(cb).toHaveBeenCalledWith(null, true);
        });
        it('should reject disallowed mimetype', () => {
            const cb = jest.fn();
            jest.spyOn(console, 'log').mockImplementation(() => { });
            (0, fileUpload_1.fileFilterFunc)({}, { mimetype: 'application/zip' }, cb);
            expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
            expect(cb.mock.calls[0][1]).toBe(false);
        });
    });
});
