"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingsModel_1 = require("../settingsModel");
const env_1 = require("../../config/env");
describe('SettingsModel', () => {
    beforeAll(async () => { await mongoose_1.default.connect(env_1.ENV.MONGO_URI); });
    afterAll(async () => { await mongoose_1.default.connection.close(); });
    it('should have default values for general', () => {
        const doc = new settingsModel_1.SettingsModel();
        expect(doc.general.siteName).toBe('');
        expect(doc.general.siteLogo).toBe('');
        expect(doc.general.favicon).toBe('');
        expect(doc.general.defaultCurrency).toBe('');
        expect(doc.general.currencyIcon).toBe('');
        expect(doc.general.timezone).toBe('');
    });
    it('should have default values for contact', () => {
        const doc = new settingsModel_1.SettingsModel();
        expect(doc.contact.companyName).toBe('');
        expect(doc.contact.contactEmail).toBe('');
        expect(doc.contact.contactPhone).toBe('');
        expect(doc.contact.address).toBe('');
    });
    it('should have default values for email', () => {
        const doc = new settingsModel_1.SettingsModel();
        expect(doc.email.email).toBe('');
        expect(doc.email.mailHost).toBe('');
        expect(doc.email.smtpUsername).toBe('');
        expect(doc.email.smtpPassword).toBe('');
        expect(doc.email.mailPort).toBe(0);
        expect(doc.email.emailEncryption).toBe('');
    });
});
