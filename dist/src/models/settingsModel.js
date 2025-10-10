"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const settingsSchema = new Schema({
    general: {
        siteName: { type: String, default: "" },
        siteLogo: { type: String, default: "" },
        favicon: { type: String, default: "" },
        defaultCurrency: { type: String, default: "" },
        currencyIcon: { type: String, default: "" },
        timezone: { type: String, default: "" },
    },
    contact: {
        companyName: { type: String, default: "" },
        contactEmail: { type: String, default: "" },
        contactPhone: { type: String, default: "" },
        address: { type: String, default: "" },
    },
    email: {
        email: { type: String, default: "" },
        mailHost: { type: String, default: "" },
        smtpUsername: { type: String, default: "" },
        smtpPassword: { type: String, default: "" },
        mailPort: { type: Number, default: 0 },
        emailEncryption: { type: String, default: "" },
    },
    seo: {
        metaTitle: { type: String, default: "" },
        metaDescription: { type: String, default: "" },
        metaKeyword: { type: String, default: "" },
        canonicalUrl: { type: String, default: "" },
        robotsMeta: { type: String, default: "" },
        schemaMarkup: { type: String, default: "" },
        h1Tag: { type: String, default: "" },
        breadcrumbs: { type: String, default: "" },
        altText: { type: String, default: "" },
        sitemapUrl: { type: String, default: "" },
        googleAnalyticsCode: { type: String, default: "" },
        googleSearchConsoleCode: { type: String, default: "" },
    },
    og: {
        ogTitle: { type: String, default: "" },
        ogDescription: { type: String, default: "" },
        ogImage: { type: String, default: "" },
        ogUrl: { type: String, default: "" },
        ogType: { type: String, default: "" },
    },
}, { timestamps: true });
exports.SettingsModel = mongoose_1.default.model("Settings", settingsSchema);
