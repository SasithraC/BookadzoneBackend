import { SettingsModel, ISettings } from '../models/settingsModel';

class SettingsRepository {
  async getSettings(): Promise<ISettings | null> {
    try {
      return await SettingsModel.findOne();
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  async createSettings(data: Partial<ISettings>): Promise<ISettings> {
    try {
      return await SettingsModel.create(data);
    } catch (error) {
      console.error('Error creating settings:', error);
      throw error;
    }
  }

  async updateSettings(data: Partial<ISettings>): Promise<ISettings | null> {
    try {
      const settings = await SettingsModel.findOne();
      if (!settings) return null;

      // Deep merge the nested objects
      if (data.general) {
        settings.general = { ...settings.general, ...data.general };
      }
      if (data.contact) {
        settings.contact = { ...settings.contact, ...data.contact };
      }
      if (data.email) {
        settings.email = { ...settings.email, ...data.email };
      }
      if (data.seo) {
        settings.seo = { ...settings.seo, ...data.seo };
      }
      if (data.og) {
        settings.og = { ...settings.og, ...data.og };
      }

      await settings.save();
      return settings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
}

export default new SettingsRepository();