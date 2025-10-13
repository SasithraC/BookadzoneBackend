"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menuPermissonModel_1 = require("../models/menuPermissonModel");
const seedMenuPermissions = async () => {
    try {
        await menuPermissonModel_1.MenuPermissionModel.deleteMany();
        const permissions = [
            {
                name: "View",
                slug: "view",
                sortOrder: 1,
                status: "active",
                isDeleted: false,
            },
            {
                name: "Edit",
                slug: "edit",
                sortOrder: 2,
                status: "active",
                isDeleted: false,
            },
            {
                name: "Add",
                slug: "add",
                sortOrder: 3,
                status: "active",
                isDeleted: false,
            },
            {
                name: "Delete",
                slug: "delete",
                sortOrder: 4,
                status: "active",
                isDeleted: false,
            },
        ];
        await menuPermissonModel_1.MenuPermissionModel.insertMany(permissions);
        console.log("✅ Menu Permissions seeded successfully");
    }
    catch (error) {
        console.error("❌ Seeding Menu Permissions failed:", error);
    }
};
exports.default = seedMenuPermissions;
