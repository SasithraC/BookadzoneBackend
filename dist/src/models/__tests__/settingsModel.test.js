"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settingsModel_1 = require("../settingsModel");
describe('SettingsModel', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterAll(() => {
        console.error.mockRestore();
    });
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
