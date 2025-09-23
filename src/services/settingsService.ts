import { ISettings } from "../models/settingsModel";
import settingsRepository from "../repositories/settingsRepository";

class SettingsService {
  async getSettings(): Promise<ISettings> {
    try {
      let settings = await settingsRepository.getSettings();
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
        settings = await settingsRepository.createSettings(defaultSettings);
      }
      return settings;
    } catch (error) {
      console.error('Error in getSettings service:', error);
      throw error;
    }
  }

  async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
    try {
      let settings = await settingsRepository.getSettings();
      if (!settings) {
        settings = await settingsRepository.createSettings(data);
        return settings;
      }
      const updated = await settingsRepository.updateSettings(data);
      if (!updated) {
        throw new Error('Failed to update settings: No settings document found');
      }
      return updated;
    } catch (error) {
      console.error('Error in updateSettings service:', error);
      throw error;
    }
  }
}

export default new SettingsService();