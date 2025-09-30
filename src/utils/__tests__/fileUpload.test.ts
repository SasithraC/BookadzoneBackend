
import path from 'path';
import { destination, filename, fileFilterFunc } from '../fileUpload';
import type { Request } from 'express';

describe('fileUpload utility', () => {
  describe('destination', () => {
    it('should create correct folder path and call cb with path', (done) => {
      const req = { managementName: 'settings' } as any as Request & { managementName: string };
      const file: any = { fieldname: 'siteLogo', originalname: 'logo.png' };
      const cb = (err: Error | null, folderPath: string) => {
        expect(err).toBeNull();
        expect(folderPath).toContain(path.join('uploads', 'settings', 'siteLogo'));
        done();
      };
      destination(req as any, file, cb);
    });

    it('should sanitize managementName and create folder', (done) => {
      const req = { managementName: 'set@tings!#' } as any as Request & { managementName: string };
      const file: any = { fieldname: 'favicon', originalname: 'favicon.ico' };
      const cb = (err: Error | null, folderPath: string) => {
        expect(err).toBeNull();
        expect(folderPath).toContain(path.join('uploads', 'settings', 'favicon'));
        done();
      };
      destination(req as any, file, cb);
    });
  });

  describe('filename', () => {
    it('should generate a filename with timestamp and random number', () => {
  const req = {} as any as Request;
  const file: any = { originalname: 'logo.png' };
  const cb = jest.fn();
  filename(req as any, file, cb);
  expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/\d+_\d+\.png$/));
    });
  });

  describe('fileFilterFunc', () => {
    it('should accept allowed file types', () => {
  const req = {} as any as Request;
  const file: any = { mimetype: 'image/png' };
  const cb = jest.fn();
  fileFilterFunc(req as any, file, cb);
  expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should reject disallowed file types', () => {
  const req = {} as any as Request;
  const file: any = { mimetype: 'application/exe' };
  const cb = jest.fn();
  fileFilterFunc(req as any, file, cb);
  expect(cb).toHaveBeenCalledWith(null, false);
    });
  });
});
