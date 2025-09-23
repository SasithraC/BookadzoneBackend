"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const footerinfoModel_1 = require("../models/footerinfoModel");
const seedFooterInfos = async () => {
    try {
        await footerinfoModel_1.FooterInfoModel.deleteMany();
        const footerInfos = [
            {
                title: "Contact Us",
                content: "For any inquiries, reach out to support@bookadzone.com.",
                status: "active",
                isDeleted: false,
            },
            {
                title: "Terms & Conditions",
                content: "Read the full terms and conditions for using Bookadzone services.",
                status: "active",
                isDeleted: false,
            },
            {
                title: "Privacy Policy",
                content: "Learn how your data is protected and used at Bookadzone.",
                status: "inactive",
                isDeleted: false,
            },
        ];
        await footerinfoModel_1.FooterInfoModel.insertMany(footerInfos);
        console.log("FooterInfo data seeded successfully");
    }
    catch (error) {
        console.error("Seeding FooterInfos failed:", error);
    }
};
exports.default = seedFooterInfos;
