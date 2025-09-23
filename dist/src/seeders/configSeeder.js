"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configModel_1 = require("../models/configModel");
const seedConfigs = async () => {
    try {
        await configModel_1.ConfigModel.deleteMany();
        const configs = [
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
        await configModel_1.ConfigModel.insertMany(configs);
        console.log("Config data seeded successfully");
    }
    catch (error) {
        console.error("Seeding Configs failed:", error);
    }
};
exports.default = seedConfigs;
