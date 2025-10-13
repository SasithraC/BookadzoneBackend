"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const roleModel_1 = require("../models/roleModel");
const rolePrivilegeModel_1 = require("../models/rolePrivilegeModel");
const seedUser = async () => {
    try {
        // 1️⃣ Get all roles
        const roles = await roleModel_1.RoleModel.find();
        if (!roles.length) {
            console.log("⚠️ No roles found. Please seed roles first.");
            return;
        }
        // 2️⃣ Get all users
        const users = await userModel_1.default.find();
        if (!users.length) {
            console.log("⚠️ No users found in DB.");
            return;
        }
        // 3️⃣ Loop through users and assign roles/privileges
        for (const user of users) {
            // Assign role based on your logic
            // (For example, first user = admin, second = subadmin, rest = agency)
            let roleName = "agency";
            if (user.email.includes("admin"))
                roleName = "admin";
            else if (user.email.includes("subadmin"))
                roleName = "subadmin";
            const role = roles.find((r) => r.name === roleName);
            if (!role)
                continue;
            // Find all privileges for that role
            const privileges = await rolePrivilegeModel_1.RolePrivilgeModel.find({ roleId: role._id });
            const privilegeIds = privileges.map((p) => p._id);
            // Update the user with roleId and rolePrivilegeIds
            await userModel_1.default.updateOne({ _id: user._id }, {
                $set: {
                    roleId: role._id,
                    rolePrivilegeIds: privilegeIds,
                },
            });
            console.log(`✅ Updated ${user.email} → ${roleName}`);
        }
        console.log("🎉 All users updated with roles & privileges!");
    }
    catch (error) {
        console.error("❌ Error assigning roles/privileges:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
exports.default = seedUser;
