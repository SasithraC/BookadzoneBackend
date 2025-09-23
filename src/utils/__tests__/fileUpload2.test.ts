import multer from 'multer';
import path from 'path';
import fs from 'fs';
import upload, { destination, filename, fileFilterFunc } from '../fileUpload';

describe('fileUpload utility', () => {
  describe('destination', () => {
    it('should create correct folder path and call cb with path', (done) => {
      const req: any = { body: { managementName: 'settings' } };
      const file: any = { fieldname: 'siteLogo', originalname: 'logo.png' };
      const cb = (err: Error | null, folderPath: string) => {
        expect(err).toBeNull();
        expect(folderPath).toContain(path.join('uploads', 'settings', 'siteLogo'));
        done();
      };
      destination(req, file, cb);
    });

    it('should sanitize managementName and create folder', (done) => {
      const req: any = { body: { managementName: 'set@tings!#' } };
      const file: any = { fieldname: 'favicon', originalname: 'favicon.ico' };
      const cb = (err: Error | null, folderPath: string) => {
        expect(err).toBeNull();
        expect(folderPath).toContain(path.join('uploads', 'settings', 'favicon'));
        done();
      };
      destination(req, file, cb);
    });
  });

  describe('filename', () => {
    it('should generate a filename with timestamp and random number', () => {
      const req: any = {};
      const file: any = { originalname: 'logo.png' };
      const cb = jest.fn();
      filename(req, file, cb);
      expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/\d+_\d+\.png$/));
    });
  });

  describe('fileFilterFunc', () => {
    it('should accept allowed file types', () => {
      const req: any = {};
      const file: any = { mimetype: 'image/png' };
      const cb = jest.fn();
      fileFilterFunc(req, file, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should reject disallowed file types', () => {
      const req: any = {};
      const file: any = { mimetype: 'application/exe' };
      const cb = jest.fn();
      fileFilterFunc(req, file, cb);
      expect(cb).toHaveBeenCalledWith(expect.any(Error), false);
    });
  });
});
