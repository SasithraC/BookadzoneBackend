import settingsService from '../settingsService';
import settingsRepository from '../../repositories/settingsRepository';
import { ISettings } from '../../models/settingsModel';

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
} as ISettings;

describe('settingsService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should return settings if found', async () => {
      (settingsRepository.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      const result = await settingsService.getSettings();
      expect(result).toEqual(mockSettings);
      expect(settingsRepository.getSettings).toHaveBeenCalled();
    });

    it('should create default settings if not found', async () => {
      (settingsRepository.getSettings as jest.Mock).mockResolvedValue(null);
      (settingsRepository.createSettings as jest.Mock).mockResolvedValue(mockSettings);
      const result = await settingsService.getSettings();
      expect(result).toEqual(mockSettings);
      expect(settingsRepository.createSettings).toHaveBeenCalled();
    });
  });

  describe('updateSettings', () => {
    it('should update settings if found', async () => {
      (settingsRepository.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (settingsRepository.updateSettings as jest.Mock).mockResolvedValue(mockSettings);
      const result = await settingsService.updateSettings({
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
      expect(settingsRepository.updateSettings).toHaveBeenCalledWith({
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
      (settingsRepository.getSettings as jest.Mock).mockResolvedValue(null);
      (settingsRepository.createSettings as jest.Mock).mockResolvedValue(mockSettings);
      const result = await settingsService.updateSettings({
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
      expect(settingsRepository.createSettings).toHaveBeenCalledWith({
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
      (settingsRepository.getSettings as jest.Mock).mockResolvedValue(mockSettings);
      (settingsRepository.updateSettings as jest.Mock).mockResolvedValue(null);
      await expect(settingsService.updateSettings({
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
