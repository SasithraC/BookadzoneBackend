"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settingsRepository_1 = __importDefault(require("../settingsRepository"));
const settingsModel_1 = require("../../models/settingsModel");
jest.mock('../../models/settingsModel');
describe('settingsRepository', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterAll(() => {
        console.error.mockRestore();
    });
    afterEach(() => jest.clearAllMocks());
    it('should get settings', async () => {
        settingsModel_1.SettingsModel.findOne.mockResolvedValue({
            general: {
                siteName: '',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        });
        const result = await settingsRepository_1.default.getSettings();
        expect(result).toBeDefined();
        expect(settingsModel_1.SettingsModel.findOne).toHaveBeenCalled();
    });
    it('should throw error if getSettings fails', async () => {
        settingsModel_1.SettingsModel.findOne.mockRejectedValue(new Error('fail'));
        await expect(settingsRepository_1.default.getSettings()).rejects.toThrow('fail');
    });
    it('should create settings', async () => {
        settingsModel_1.SettingsModel.create.mockResolvedValue({
            general: {
                siteName: '',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        });
        const result = await settingsRepository_1.default.createSettings({
            general: {
                siteName: '',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        });
        expect(result).toBeDefined();
        expect(settingsModel_1.SettingsModel.create).toHaveBeenCalledWith({
            general: {
                siteName: '',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        });
    });
    it('should throw error if createSettings fails', async () => {
        settingsModel_1.SettingsModel.create.mockRejectedValue(new Error('fail'));
        await expect(settingsRepository_1.default.createSettings({
            general: {
                siteName: '',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        })).rejects.toThrow('fail');
    });
    it('should update settings', async () => {
        const mockSettings = { general: {}, save: jest.fn().mockResolvedValue(true) };
        settingsModel_1.SettingsModel.findOne.mockResolvedValue(mockSettings);
        const result = await settingsRepository_1.default.updateSettings({
            general: {
                siteName: 'Updated',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        });
        expect(result).toBeDefined();
        expect(mockSettings.save).toHaveBeenCalled();
    });
    it('should return null if no settings found in updateSettings', async () => {
        settingsModel_1.SettingsModel.findOne.mockResolvedValue(null);
        const result = await settingsRepository_1.default.updateSettings({
            general: {
                siteName: '',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        });
        expect(result).toBeNull();
    });
    it('should throw error if updateSettings fails', async () => {
        settingsModel_1.SettingsModel.findOne.mockRejectedValue(new Error('fail'));
        await expect(settingsRepository_1.default.updateSettings({
            general: {
                siteName: '',
                siteLogo: '',
                favicon: '',
                defaultCurrency: '',
                currencyIcon: '',
                timezone: '',
            }
        })).rejects.toThrow('fail');
    });
});
