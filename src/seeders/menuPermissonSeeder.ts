import { MenuPermissionModel } from "../models/menuPermissonModel";

interface IMenuPermissionSeed {
  name: string;
  slug: string;
  sortOrder: number;
  status: "active" | "inactive";
  isDeleted: boolean;
}

const seedMenuPermissions = async (): Promise<void> => {
  try {    
    await MenuPermissionModel.deleteMany();
    const permissions: IMenuPermissionSeed[] = [
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

    await MenuPermissionModel.insertMany(permissions);
    console.log("✅ Menu Permissions seeded successfully");
  } catch (error) {
    console.error("❌ Seeding Menu Permissions failed:", error);
  }
};

export default seedMenuPermissions;
