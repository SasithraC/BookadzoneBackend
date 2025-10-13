import mongoose from "mongoose";
import { SettingsModel } from '../settingsModel';

jest.mock('mongoose', () => {
  const mockDoc = {
    general: {
      siteName: '', siteLogo: '', favicon: '', defaultCurrency: '', currencyIcon: '', timezone: ''
    },
    contact: {
      companyName: '', contactEmail: '', contactPhone: '', address: ''
    },
    email: {
      email: '', mailHost: '', smtpUsername: '', smtpPassword: '', mailPort: 0, emailEncryption: ''
    },
    seo: {
      metaTitle: '', metaDescription: '', metaKeyword: '', canonicalUrl: '', robotsMeta: '',
      schemaMarkup: '', h1Tag: '', breadcrumbs: '', altText: '', sitemapUrl: '',
      googleAnalyticsCode: '', googleSearchConsoleCode: ''
    },
    og: {
      ogTitle: '', ogDescription: '', ogImage: '', ogUrl: '', ogType: ''
    }
  };

  return {
    model: jest.fn(() => (class {
      constructor() {
        Object.assign(this, mockDoc);
      }
    })),
    Schema: jest.fn().mockImplementation(() => ({
      obj: {},
    }))
  };
});

describe('SettingsModel', () => {
  it('should have default values for general', () => {
    const doc = new SettingsModel();
    expect(doc.general.siteName).toBe('');
    expect(doc.general.siteLogo).toBe('');
    expect(doc.general.favicon).toBe('');
    expect(doc.general.defaultCurrency).toBe('');
    expect(doc.general.currencyIcon).toBe('');
    expect(doc.general.timezone).toBe('');
  });

  it('should have default values for contact', () => {
    const doc = new SettingsModel();
    expect(doc.contact.companyName).toBe('');
    expect(doc.contact.contactEmail).toBe('');
    expect(doc.contact.contactPhone).toBe('');
    expect(doc.contact.address).toBe('');
  });

  it('should have default values for email', () => {
    const doc = new SettingsModel();
    expect(doc.email.email).toBe('');
    expect(doc.email.mailHost).toBe('');
    expect(doc.email.smtpUsername).toBe('');
    expect(doc.email.smtpPassword).toBe('');
    expect(doc.email.mailPort).toBe(0);
    expect(doc.email.emailEncryption).toBe('');
  });

  it('should have default values for seo', () => {
    const doc = new SettingsModel();
    expect(doc.seo.metaTitle).toBe('');
    expect(doc.seo.metaDescription).toBe('');
    expect(doc.seo.metaKeyword).toBe('');
    expect(doc.seo.canonicalUrl).toBe('');
    expect(doc.seo.robotsMeta).toBe('');
    expect(doc.seo.schemaMarkup).toBe('');
    expect(doc.seo.h1Tag).toBe('');
    expect(doc.seo.breadcrumbs).toBe('');
    expect(doc.seo.altText).toBe('');
    expect(doc.seo.sitemapUrl).toBe('');
    expect(doc.seo.googleAnalyticsCode).toBe('');
    expect(doc.seo.googleSearchConsoleCode).toBe('');
  });

  it('should have default values for og', () => {
    const doc = new SettingsModel();
    expect(doc.og.ogTitle).toBe('');
    expect(doc.og.ogDescription).toBe('');
    expect(doc.og.ogImage).toBe('');
    expect(doc.og.ogUrl).toBe('');
    expect(doc.og.ogType).toBe('');
  });
});
