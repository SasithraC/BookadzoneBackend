
import { upload, processUpload, deleteFile } from '../fileUpload';
import type { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import multer from 'multer';
import sharp from 'sharp';

jest.mock('multer', () => {
  const mockMemoryStorage = () => ({});
  return {
    memoryStorage: mockMemoryStorage,
    default: {
      memoryStorage: mockMemoryStorage
    }
  };
});

jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    png: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock optimized image'))
  }));
});

const mkdtemp = promisify(fs.mkdtemp);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

describe('fileUpload utility', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp('test-uploads-');
  });

  afterEach(async () => {
    try {
      await unlink(path.join(testDir, 'test.png'));
    } catch {}
    await rmdir(testDir);
  });

  describe('upload middleware', () => {
    it('should have proper configuration', () => {
      expect(upload).toBeDefined();
      expect(multer).toHaveBeenCalled();
    });
  });

  describe('processUpload', () => {
    it('should process and store a valid image file', async () => {
      const req = {
        managementName: 'test-management'
      };

      const file = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: '/uploads',
        filename: 'test.png',
        path: '/uploads/test.png',
        size: 12345,
        buffer: Buffer.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
          0x00, 0x00, 0x00, 0x0d, // IHDR chunk length
          0x49, 0x48, 0x44, 0x52  // IHDR chunk type
        ])
      };

      const result = await processUpload(req as any, file as any);
      expect(result).toHaveProperty('filename');
      expect(result).toHaveProperty('thumbnail');
      expect(result.filename).toMatch(/\d+_[a-f0-9]+\.png$/);
      expect(result.thumbnail).toMatch(/^thumb_\d+_[a-f0-9]+\.png$/);
    });

    it('should create upload directories if they don\'t exist', async () => {
      const req = {
        managementName: 'test-new-dir'
      };

      const file = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: '/uploads',
        filename: 'test.png',
        path: '/uploads/test.png',
        size: 12345,
        buffer: Buffer.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
          0x00, 0x00, 0x00, 0x0d, // IHDR chunk length
          0x49, 0x48, 0x44, 0x52  // IHDR chunk type
        ])
      };

      await processUpload(req as any, file as any);
      
      const uploadPath = path.join('uploads', 'test-new-dir');
      const thumbnailPath = path.join(uploadPath, 'thumbnails');
      
      expect(await exists(uploadPath)).toBe(true);
      expect(await exists(thumbnailPath)).toBe(true);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file and its thumbnail', async () => {
      const managementName = 'test-delete';
      const filename = 'test-file.png';
      const uploadPath = path.join('uploads', managementName);
      const filePath = path.join(uploadPath, filename);
      const thumbnailPath = path.join(uploadPath, 'thumbnails', `thumb_${filename}`);

      // Create test file and thumbnail
      await fs.promises.mkdir(path.join(uploadPath, 'thumbnails'), { recursive: true });
      await writeFile(filePath, 'test content');
      await writeFile(thumbnailPath, 'thumbnail content');

      const result = await deleteFile(managementName, filename);
      expect(result).toBe(true);
      expect(await exists(filePath)).toBe(false);
      expect(await exists(thumbnailPath)).toBe(false);
    });

    it('should return false for non-existent file', async () => {
      const result = await deleteFile('non-existent', 'non-existent.png');
      expect(result).toBe(false);
    });
  });
});
