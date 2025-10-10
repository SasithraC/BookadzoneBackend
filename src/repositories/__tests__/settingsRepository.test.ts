import settingsRepository from '../settingsRepository';
import { SettingsModel } from '../../models/settingsModel';

jest.mock('../../models/settingsModel');

describe('settingsRepository', () => {
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get settings', async () => {
    (SettingsModel.findOne as jest.Mock).mockResolvedValue({
      general: {
        siteName: '',
        siteLogo: '',
        favicon: '',
        defaultCurrency: '',
        currencyIcon: '',
        timezone: '',
      }
    });
    const result = await settingsRepository.getSettings();
    expect(result).toBeDefined();
    expect(SettingsModel.findOne).toHaveBeenCalled();
  });

  it('should throw error if getSettings fails', async () => {
    (SettingsModel.findOne as jest.Mock).mockRejectedValue(new Error('fail'));
    await expect(settingsRepository.getSettings()).rejects.toThrow('fail');
  });

  it('should create settings', async () => {
    (SettingsModel.create as jest.Mock).mockResolvedValue({
      general: {
        siteName: '',
        siteLogo: '',
        favicon: '',
        defaultCurrency: '',
        currencyIcon: '',
        timezone: '',
      }
    });
    const result = await settingsRepository.createSettings({
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
    expect(SettingsModel.create).toHaveBeenCalledWith({
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
    (SettingsModel.create as jest.Mock).mockRejectedValue(new Error('fail'));
    await expect(settingsRepository.createSettings({
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
    (SettingsModel.findOne as jest.Mock).mockResolvedValue(mockSettings);
    const result = await settingsRepository.updateSettings({
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
    (SettingsModel.findOne as jest.Mock).mockResolvedValue(null);
    const result = await settingsRepository.updateSettings({
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
    (SettingsModel.findOne as jest.Mock).mockRejectedValue(new Error('fail'));
    await expect(settingsRepository.updateSettings({
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
