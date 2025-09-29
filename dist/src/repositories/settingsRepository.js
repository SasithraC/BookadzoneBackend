"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settingsModel_1 = require("../models/settingsModel");
class SettingsRepository {
    async getSettings() {
        try {
            return await settingsModel_1.SettingsModel.findOne();
        }
        catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    }
    async createSettings(data) {
        try {
            return await settingsModel_1.SettingsModel.create(data);
        }
        catch (error) {
            console.error('Error creating settings:', error);
            throw error;
        }
    }
    async updateSettings(data) {
        try {
            const settings = await settingsModel_1.SettingsModel.findOne();
            if (!settings)
                return null;
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
        }
        catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }
}
exports.default = new SettingsRepository();
