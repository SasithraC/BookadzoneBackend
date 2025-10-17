import mongoose from "mongoose";
import User from "../models/userModel";
import { RoleModel } from "../models/roleModel";
import { RolePrivilgeModel } from "../models/rolePrivilegeModel";


const seedUser = async () => {
  try {
    // 1️⃣ Get all roles
    const roles = await RoleModel.find();
    if (!roles.length) {
      console.log("⚠️ No roles found. Please seed roles first.");
      return;
    }

    // 2️⃣ Get all users
    const users = await User.find();
    if (!users.length) {
      console.log("⚠️ No users found in DB.");
      return;
    }

    // 3️⃣ Loop through users and assign roles/privileges
    for (const user of users) {
      // Assign role based on your logic
      // (For example, first user = admin, second = subadmin, rest = agency)
      let roleName = "agency";
      if (user.email.includes("admin")) roleName = "admin";
      else if (user.email.includes("subadmin")) roleName = "subadmin";

      const role = roles.find((r) => r.name === roleName);
      if (!role) continue;

      // Find all privileges for that role
      const privileges = await RolePrivilgeModel.find({ roleId: role._id });
      const privilegeIds = privileges.map((p) => p._id);

      // Update the user with roleId and rolePrivilegeIds
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            roleId: role._id,
            rolePrivilegeIds: privilegeIds,
          },
        }
      );

      console.log(`✅ Updated ${user.email} → ${roleName}`);
    }

    console.log("🎉 All users updated with roles & privileges!");
  } catch (error) {
    console.error("❌ Error assigning roles/privileges:", error);
  } finally {
    mongoose.connection.close();
  }
};
export default seedUser;
