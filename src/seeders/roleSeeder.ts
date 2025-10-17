import { RoleModel } from "../models/roleModel";

const seedRoles = async () => {
  try {
    // Clear existing roles
    await RoleModel.deleteMany();
    console.log("🗑️ Cleared existing roles");

    // Define default roles
    const roles = [
      {
        name: "super-admin",
        slug: "super-admin",
        displayName: "Super Administrator",
        description: "Full system access with all privileges",
        status: "active",
        isDeleted: false,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "admin",
        slug: "admin",
        displayName: "Administrator",
        description: "Administrative access with most privileges",
        status: "active",
        isDeleted: false,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "subadmin",
        slug: "subadmin",
        displayName: "Sub Administrator",
        description: "Limited administrative access",
        status: "active",
        isDeleted: false,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "agency",
        slug: "agency",
        displayName: "Agency",
        description: "Agency level access for managing properties and campaigns",
        status: "active",
        isDeleted: false,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert roles
    const insertedRoles = await RoleModel.insertMany(roles);
    console.log(`✅ Seeded roles: ${insertedRoles.length}`);
    
    return insertedRoles;
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    throw error;
  }
};

export default seedRoles;