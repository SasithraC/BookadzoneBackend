import { GroupModel } from "../models/menuGroupModel";
import { SubmenuModel } from "../models/subMenuModel";
import { MenuPermissionModel } from "../models/menuPermissonModel";
import { Types } from "mongoose";

const seedGroups = async () => {
  try {
    await GroupModel.deleteMany();
    console.log("🗑️ Cleared existing MenuGroups");

    const submenus = await SubmenuModel.find({ isDeleted: false, status: "active" });
    if (!submenus.length) {
      console.error("❌ No submenus found. Run seedSubMenus first!");
      return;
    }

    const permissions = await MenuPermissionModel.find({ isDeleted: false, status: "active" });
    if (!permissions.length) {
      console.error("❌ No permissions found. Seed MenuPermission first!");
      return;
    }

    const groupsToInsert: any[] = [];
    const superAdminPermissions = ["view", "add", "create", "edit", "delete"];

    // Use a Map to track unique slugs and their associated permissions
    const slugPermissionMap: Map<string, Set<string>> = new Map();

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
          slugPermissionMap.get(slug)!.add(perm._id.toString());
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
            menuPermissionId: new Types.ObjectId(permId),
            status: "active",
            isDeleted: false,
          });
        }
      }
    }

    const insertedGroups = await GroupModel.insertMany(groupsToInsert);
    console.log(`✅ Seeded MenuGroups: ${insertedGroups.length}`);
    return insertedGroups;
  } catch (err) {
    console.error("❌ Error seeding MenuGroups:", err);
    throw err;
  }
};

export default seedGroups;