import mongoose, { Document } from "mongoose";
const { Schema } = mongoose;

export interface ISettings extends Document {
  general: {
    siteName: string;
    siteLogo: string;
    favicon: string;
    defaultCurrency: string;
    currencyIcon: string;
    timezone: string;
  };
  contact: {
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  email: {
    email: string;
    mailHost: string;
    smtpUsername: string;
    smtpPassword: string;
    mailPort: number;
    emailEncryption: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    canonicalUrl: string;
    robotsMeta: string;
    schemaMarkup: string;
    h1Tag: string;
    breadcrumbs: string;
    altText: string;
    sitemapUrl: string;
    googleAnalyticsCode: string;
    googleSearchConsoleCode: string;
  };
  og: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
  };
}


const settingsSchema = new Schema<ISettings>({
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

export const SettingsModel = mongoose.model<ISettings>("Settings", settingsSchema);