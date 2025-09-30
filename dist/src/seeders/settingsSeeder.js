"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settingsModel_1 = require("../models/settingsModel");
const defaultSettings = {
    general: {
        siteName: 'Bookadzone',
        siteLogo: '/uploads/default-logo.png',
        favicon: '/uploads/default-favicon.ico',
        defaultCurrency: 'USD',
        currencyIcon: '$',
        timezone: 'UTC',
    },
    contact: {
        companyName: 'Bookadzone Inc.',
        contactEmail: 'info@bookadzone.com',
        contactPhone: '',
        address: '',
    },
    email: {
        email: 'noreply@bookadzone.com',
        mailHost: '',
        smtpUsername: '',
        smtpPassword: '',
        mailPort: 587,
        emailEncryption: 'tls',
    },
    seo: {
        metaTitle: 'Bookadzone - Outdoor Advertising',
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
        ogImage: '/uploads/default-og-image.png',
        ogUrl: '',
        ogType: '',
    },
};
const seedSettings = async () => {
    try {
        await settingsModel_1.SettingsModel.deleteMany();
        await settingsModel_1.SettingsModel.create(defaultSettings);
        console.log('Settings data seeded successfully');
    }
    catch (error) {
        console.error('Seeding settings failed:', error);
    }
};
exports.default = seedSettings;
