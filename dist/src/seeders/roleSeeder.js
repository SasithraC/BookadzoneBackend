"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleModel_1 = require("../models/roleModel");
const seedRoles = async () => {
    try {
        await roleModel_1.RoleModel.deleteMany();
        const roles = [
            {
                name: "admin",
                description: "Super admin with full access",
                status: "active",
                isDeleted: false,
            },
            {
                name: "subadmin",
                description: "Sub admin with limited access",
                status: "active",
                isDeleted: false,
            },
            {
                name: "agency",
                description: "Agency role for billboard advertisers",
                status: "active",
                isDeleted: false,
            },
        ];
        await roleModel_1.RoleModel.insertMany(roles);
        console.log("✅ Role data seeded successfully");
    }
    catch (error) {
        console.error("❌ Seeding Roles failed:", error);
    }
};
exports.default = seedRoles;
