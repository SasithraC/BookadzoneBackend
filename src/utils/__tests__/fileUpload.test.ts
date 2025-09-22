import fs from 'fs';
import path from 'path';
import { destination, filename, fileFilterFunc } from '../fileUpload';

describe('fileUpload utils', () => {
  describe('destination', () => {
    it('should create folder and call cb with path', () => {
      const req = { body: { managementName: 'test' } };
      const file = { originalname: 'file.txt', fieldname: 'docs', mimetype: 'text/plain' };
      const cb = jest.fn();
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => path.join('uploads', 'test', 'docs'));
      jest.spyOn(console, 'log').mockImplementation(() => {});
      destination(req, file, cb);
      expect(fs.mkdirSync).toHaveBeenCalledWith(path.join('uploads', 'test', 'docs'), { recursive: true });
      expect(cb).toHaveBeenCalledWith(null, path.join('uploads', 'test', 'docs'));
    });
    it('should handle error and call cb with error', () => {
      const req = { body: { managementName: 'test' } };
      const file = { originalname: 'file.txt', fieldname: 'docs', mimetype: 'text/plain' };
      const cb = jest.fn();
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => { throw new Error('fail'); });
      jest.spyOn(console, 'error').mockImplementation(() => {});
      destination(req, file, cb);
      expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(cb.mock.calls[0][1]).toBe('');
    });
  });

  describe('filename', () => {
    it('should generate filename and call cb', () => {
      const req = { body: {} };
      const file = { originalname: 'file.pdf', fieldname: 'docs', mimetype: 'application/pdf' };
      const cb = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(() => {});
      filename(req, file, cb);
      expect(cb.mock.calls[0][0]).toBeNull();
      expect(cb.mock.calls[0][1]).toMatch(/\d+_\d+\.pdf/);
    });
  });

  describe('fileFilterFunc', () => {
    it('should accept allowed mimetype', () => {
      const cb = jest.fn();
      fileFilterFunc({}, { mimetype: 'image/png' }, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });
    it('should reject disallowed mimetype', () => {
      const cb = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(() => {});
      fileFilterFunc({}, { mimetype: 'application/zip' }, cb);
      expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(cb.mock.calls[0][1]).toBe(false);
    });
  });
});
