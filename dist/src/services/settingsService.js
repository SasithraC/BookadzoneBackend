"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settingsRepository_1 = __importDefault(require("../repositories/settingsRepository"));
class SettingsService {
    async getSettings() {
        try {
            let settings = await settingsRepository_1.default.getSettings();
            if (!settings) {
                const defaultSettings = {
                    general: {
                        siteName: '',
                        siteLogo: '',
                        favicon: '',
                        defaultCurrency: '',
                        currencyIcon: '',
                        timezone: '',
                    },
                    contact: {
                        companyName: '',
                        contactEmail: '',
                        contactPhone: '',
                        address: '',
                    },
                    email: {
                        email: '',
                        mailHost: '',
                        smtpUsername: '',
                        smtpPassword: '',
                        mailPort: 0,
                        emailEncryption: '',
                    },
                    seo: {
                        metaTitle: '',
                        metaDescription: '',
                        metaKeyword: '',
                        canonicalUrl: '',
                        robotsMeta: '',
                        schemaMarkup: '',
                        h1Tag: '',
                        breadcrumbs: '',
                        altText: '',
                        sitemapUrl: '',
                        googleAnalyticsCode: '',
                        googleSearchConsoleCode: '',
                    },
                    og: {
                        ogTitle: '',
                        ogDescription: '',
                        ogImage: '',
                        ogUrl: '',
                        ogType: '',
                    },
                };
                settings = await settingsRepository_1.default.createSettings(defaultSettings);
            }
            return settings;
        }
        catch (error) {
            console.error('Error in getSettings service:', error);
            throw error;
        }
    }
    async updateSettings(data) {
        try {
            let settings = await settingsRepository_1.default.getSettings();
            if (!settings) {
                settings = await settingsRepository_1.default.createSettings(data);
                return settings;
            }
            const updated = await settingsRepository_1.default.updateSettings(data);
            if (!updated) {
                throw new Error('Failed to update settings: No settings document found');
            }
            return updated;
        }
        catch (error) {
            console.error('Error in updateSettings service:', error);
            throw error;
        }
    }
}
exports.default = new SettingsService();
