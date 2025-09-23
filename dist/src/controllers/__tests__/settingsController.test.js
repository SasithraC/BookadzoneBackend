"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settingsController_1 = __importDefault(require("../settingsController"));
const settingsService_1 = __importDefault(require("../../services/settingsService"));
jest.mock('../../services/settingsService');
describe('settingsController', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterAll(() => {
        console.error.mockRestore();
    });
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it('should get settings successfully', async () => {
        settingsService_1.default.getSettings.mockResolvedValue({ general: {} });
        await settingsController_1.default.getSettings(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { general: {} },
            message: 'Settings retrieved successfully',
        });
    });
    it('should handle getSettings error', async () => {
        settingsService_1.default.getSettings.mockRejectedValue(new Error('fail'));
        await settingsController_1.default.getSettings(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'fail',
        });
    });
    describe('updateSettings', () => {
        it('should return 400 if body is missing', async () => {
            req.body = undefined;
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Request body is required',
            });
        });
        it('should return 400 if body is empty', async () => {
            req.body = {};
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Request body is required',
            });
        });
        it('should handle invalid general data format', async () => {
            req.body = { general: '{invalidJson}' };
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Invalid general data format',
            });
        });
        it('should handle file upload for siteLogo', async () => {
            req.body = { general: JSON.stringify({ siteName: 'Test' }) };
            req.files = {
                siteLogo: [{
                        fieldname: 'siteLogo',
                        originalname: 'logo.png',
                        encoding: '7bit',
                        mimetype: 'image/png',
                        destination: 'uploads/settings/siteLogo',
                        filename: 'logo.png',
                        path: 'uploads/settings/siteLogo/logo.png',
                        size: 1234,
                        buffer: Buffer.from(''),
                        stream: {}
                    }],
            };
            settingsService_1.default.updateSettings.mockResolvedValue({ general: { siteLogo: 'uploads/settings/siteLogo/logo.png' } });
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Settings updated successfully',
                data: { general: { siteLogo: 'uploads/settings/siteLogo/logo.png' } },
            });
        });
        it('should handle file upload for favicon', async () => {
            req.body = { general: JSON.stringify({ siteName: 'Test' }) };
            req.files = {
                favicon: [{
                        fieldname: 'favicon',
                        originalname: 'favicon.png',
                        encoding: '7bit',
                        mimetype: 'image/png',
                        destination: 'uploads/settings/favicon',
                        filename: 'favicon.png',
                        path: 'uploads/settings/favicon/favicon.png',
                        size: 567,
                        buffer: Buffer.from(''),
                        stream: {}
                    }],
            };
            settingsService_1.default.updateSettings.mockResolvedValue({ general: { favicon: 'uploads/settings/favicon/favicon.png' } });
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Settings updated successfully',
                data: { general: { favicon: 'uploads/settings/favicon/favicon.png' } },
            });
        });
        it('should handle ValidationError', async () => {
            req.body = { general: { siteName: 'Test' } };
            const error = new Error('validation fail');
            error.name = 'ValidationError';
            error.errors = { field: 'error' };
            settingsService_1.default.updateSettings.mockRejectedValue(error);
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: `Settings validation failed: validation fail`,
                errors: { field: 'error' },
            });
        });
        it('should handle CastError', async () => {
            req.body = { general: { siteName: 'Test' } };
            const error = new Error('cast fail');
            error.name = 'CastError';
            settingsService_1.default.updateSettings.mockRejectedValue(error);
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: `Invalid data format: cast fail`,
            });
        });
        it('should handle generic error', async () => {
            req.body = { general: { siteName: 'Test' } };
            const error = new Error('generic fail');
            settingsService_1.default.updateSettings.mockRejectedValue(error);
            await settingsController_1.default.updateSettings(req, res, next);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'generic fail',
            });
        });
    });
});
