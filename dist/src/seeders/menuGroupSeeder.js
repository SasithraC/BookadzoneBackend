"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menuGroupModel_1 = require("../models/menuGroupModel");
const subMenuModel_1 = require("../models/subMenuModel");
const menuPermissonModel_1 = require("../models/menuPermissonModel");
const mongoose_1 = require("mongoose");
const seedGroups = async () => {
    try {
        await menuGroupModel_1.GroupModel.deleteMany();
        console.log("🗑️ Cleared existing MenuGroups");
        const submenus = await subMenuModel_1.SubmenuModel.find({ isDeleted: false, status: "active" });
        if (!submenus.length) {
            console.error("❌ No submenus found. Run seedSubMenus first!");
            return;
        }
        const permissions = await menuPermissonModel_1.MenuPermissionModel.find({ isDeleted: false, status: "active" });
        if (!permissions.length) {
            console.error("❌ No permissions found. Seed MenuPermission first!");
            return;
        }
        const groupsToInsert = [];
        const superAdminPermissions = ["view", "add", "create", "edit", "delete"];
        // Use a Map to track unique slugs and their associated permissions
        const slugPermissionMap = new Map();
        for (const submenu of submenus) {
            const slug = submenu.slug;
            if (!slugPermissionMap.has(slug)) {
                slugPermissionMap.set(slug, new Set());
            }
            for (const perm of permissions) {
                // Only include 'view' for dashboard submenus
                if (submenu.slug.startsWith("dashboard") && perm.slug !== "view") {
                    continue;
                }
                // Include all permissions for super-admin submenus
                if (superAdminPermissions.includes(perm.slug)) {
                    slugPermissionMap.get(slug).add(perm._id.toString());
                }
            }
        }
        // Create groups for each unique slug and its permissions
        for (const [slug, permissionIds] of slugPermissionMap.entries()) {
            const submenu = submenus.find(s => s.slug === slug);
            if (submenu) {
                for (const permId of permissionIds) {
                    groupsToInsert.push({
                        submenuId: submenu._id,
                        menuPermissionId: new mongoose_1.Types.ObjectId(permId),
                        status: "active",
                        isDeleted: false,
                    });
                }
            }
        }
        const insertedGroups = await menuGroupModel_1.GroupModel.insertMany(groupsToInsert);
        console.log(`✅ Seeded MenuGroups: ${insertedGroups.length}`);
        return insertedGroups;
    }
    catch (err) {
        console.error("❌ Error seeding MenuGroups:", err);
        throw err;
    }
};
exports.default = seedGroups;
