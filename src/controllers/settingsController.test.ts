import settingsController from './settingsController';
import settingsService from '../services/settingsService';
import { Request, Response } from 'express';

jest.mock('../services/settingsService');

describe('settingsController', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should get settings successfully', async () => {
    (settingsService.getSettings as jest.Mock).mockResolvedValue({ general: {} });
    await settingsController.getSettings(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { general: {} },
      message: 'Settings retrieved successfully',
    });
  });

  it('should handle getSettings error', async () => {
    (settingsService.getSettings as jest.Mock).mockRejectedValue(new Error('fail'));
    await settingsController.getSettings(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'fail',
    });
  });
});
