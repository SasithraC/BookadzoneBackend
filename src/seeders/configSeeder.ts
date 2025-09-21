import mongoose from "mongoose";
import { ConfigModel } from "../models/configModel";

// Config type
interface IConfig {
  name: string;
  slug: string;
  configFields: { key: string; value: string }[];
  status: "active" | "inactive";
  isDeleted: boolean;
}

const seedConfigs = async (): Promise<void> => {
  try {
    await ConfigModel.deleteMany();

    const configs: IConfig[] = [
      {
        name: "Site Settings",
        slug: "site-settings",
        configFields: [
          { key: "site_title", value: "Bookadzone" },
          { key: "site_description", value: "Outdoor Advertising Platform" },
          { key: "contact_email", value: "info@bookadzone.com" }
        ],
        status: "active",
        isDeleted: false,
      },
      {
        name: "SEO Config",
        slug: "seo-config",
        configFields: [
          { key: "meta_title", value: "Book Billboard Advertising" },
          { key: "meta_keywords", value: "billboard, advertising, outdoor" }
        ],
        status: "active",
        isDeleted: false,
      },
      {
        name: "Payment Settings",
        slug: "payment-settings",
        configFields: [
          { key: "stripe_key", value: "pk_test_..." },
          { key: "paypal_enabled", value: "true" }
        ],
        status: "inactive",
        isDeleted: false,
      },
    ];

    await ConfigModel.insertMany(configs);
    console.log("Config data seeded successfully");
  } catch (error) {
    console.error("Seeding Configs failed:", error);
  }
};

export default seedConfigs;