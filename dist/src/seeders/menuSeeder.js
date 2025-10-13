"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menuModel_1 = require("../models/menuModel");
const seedMenus = async () => {
    try {
        await menuModel_1.MenuModel.deleteMany();
        const menus = [
            {
                name: "Dashboard",
                slug: "dashboard",
                icon: "IoGrid",
                sequenceOrder: 1,
                status: "active",
                isDeleted: false,
            },
            {
                name: "Site Setting",
                slug: "site-setting",
                icon: "BsUiChecks",
                sequenceOrder: 2,
                status: "active",
                isDeleted: false,
            },
            {
                name: "Setting",
                slug: "setting",
                icon: "MdSettings",
                sequenceOrder: 3,
                status: "active",
                isDeleted: false,
            },
            {
                name: "Trash",
                slug: "trash",
                icon: "FaTrashCan",
                sequenceOrder: 4,
                status: "active",
                isDeleted: false,
            },
        ];
        await menuModel_1.MenuModel.insertMany(menus);
        console.log("✅ Menu data seeded successfully");
    }
    catch (error) {
        console.error("❌ Seeding Menus failed:", error);
    }
};
exports.default = seedMenus;
