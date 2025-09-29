"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settingsService_1 = __importDefault(require("../settingsService"));
const settingsRepository_1 = __importDefault(require("../../repositories/settingsRepository"));
jest.mock('../../repositories/settingsRepository');
const mockSettings = {
    _id: 'mockid',
    general: {
        siteName: 'Test Site',
        siteLogo: 'logo.png',
        favicon: 'favicon.ico',
        defaultCurrency: 'USD',
        currencyIcon: '$',
        timezone: 'UTC',
    },
    contact: {
        companyName: 'Test Company',
        contactEmail: 'test@example.com',
        contactPhone: '1234567890',
        address: '123 Test St',
    },
    email: {
        email: 'test@example.com',
        mailHost: 'smtp.example.com',
        smtpUsername: 'user',
        smtpPassword: 'pass',
        mailPort: 587,
        emailEncryption: 'TLS',
    },
    seo: {
        metaTitle: 'Test Title',
        metaDescription: 'Test Description',
        metaKeyword: 'Test',
        canonicalUrl: 'https://test.com',
        robotsMeta: 'index,follow',
        schemaMarkup: '{}',
        h1Tag: 'Test H1',
        breadcrumbs: 'Home > Test',
        altText: 'Test Alt',
        sitemapUrl: 'https://test.com/sitemap.xml',
        googleAnalyticsCode: 'UA-XXXXX',
        googleSearchConsoleCode: 'GSC-XXXXX',
    },
    og: {
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: 'og.png',
        ogUrl: 'https://test.com',
        ogType: 'website',
    },
};
describe('settingsService', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterAll(() => {
        console.error.mockRestore();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getSettings', () => {
        it('should return settings if found', async () => {
            settingsRepository_1.default.getSettings.mockResolvedValue(mockSettings);
            const result = await settingsService_1.default.getSettings();
            expect(result).toEqual(mockSettings);
            expect(settingsRepository_1.default.getSettings).toHaveBeenCalled();
        });
        it('should create default settings if not found', async () => {
            settingsRepository_1.default.getSettings.mockResolvedValue(null);
            settingsRepository_1.default.createSettings.mockResolvedValue(mockSettings);
            const result = await settingsService_1.default.getSettings();
            expect(result).toEqual(mockSettings);
            expect(settingsRepository_1.default.createSettings).toHaveBeenCalled();
        });
    });
    describe('updateSettings', () => {
        it('should update settings if found', async () => {
            settingsRepository_1.default.getSettings.mockResolvedValue(mockSettings);
            settingsRepository_1.default.updateSettings.mockResolvedValue(mockSettings);
            const result = await settingsService_1.default.updateSettings({
                general: {
                    siteName: 'Updated Site',
                    siteLogo: '',
                    favicon: '',
                    defaultCurrency: '',
                    currencyIcon: '',
                    timezone: '',
                }
            });
            expect(result).toEqual(mockSettings);
            expect(settingsRepository_1.default.updateSettings).toHaveBeenCalledWith({
                general: {
                    siteName: 'Updated Site',
                    siteLogo: '',
                    favicon: '',
                    defaultCurrency: '',
                    currencyIcon: '',
                    timezone: '',
                }
            });
        });
        it('should create settings if not found', async () => {
            settingsRepository_1.default.getSettings.mockResolvedValue(null);
            settingsRepository_1.default.createSettings.mockResolvedValue(mockSettings);
            const result = await settingsService_1.default.updateSettings({
                general: {
                    siteName: 'New Site',
                    siteLogo: '',
                    favicon: '',
                    defaultCurrency: '',
                    currencyIcon: '',
                    timezone: '',
                }
            });
            expect(result).toEqual(mockSettings);
            expect(settingsRepository_1.default.createSettings).toHaveBeenCalledWith({
                general: {
                    siteName: 'New Site',
                    siteLogo: '',
                    favicon: '',
                    defaultCurrency: '',
                    currencyIcon: '',
                    timezone: '',
                }
            });
        });
        it('should throw error if update fails', async () => {
            settingsRepository_1.default.getSettings.mockResolvedValue(mockSettings);
            settingsRepository_1.default.updateSettings.mockResolvedValue(null);
            await expect(settingsService_1.default.updateSettings({
                general: {
                    siteName: 'Fail',
                    siteLogo: '',
                    favicon: '',
                    defaultCurrency: '',
                    currencyIcon: '',
                    timezone: '',
                }
            })).rejects.toThrow('Failed to update settings: No settings document found');
        });
    });
});
