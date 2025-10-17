import { MenuModel } from "../models/menuModel";

interface IMenuSeed {
  name: string;
  slug: string;
  icon: string;
  sequenceOrder: number;
  status: "active" | "inactive";
  isDeleted: boolean;
}

const seedMenus = async (): Promise<void> => {
  try {
    
    await MenuModel.deleteMany();

    const menus: IMenuSeed[] = [
   
      {
        name: "Dashboard",
        slug: "dashboard",
        icon: "IoGrid",
        sequenceOrder: 1,
        status: "active",
        isDeleted: false,
      },    
      {
        name: "Agency",
        slug: "agency",
        icon: "MdVerifiedUser",
        sequenceOrder: 2,
        status: "active",
        isDeleted: false,
      }, 
      {
        name: "banner",
        slug: "banner",
        icon: "MdAdsClick",
        sequenceOrder: 3,
        status: "active",
        isDeleted: false,
      },  
      {
        name: "Site Setting",
        slug: "site-setting",
        icon: "BsUiChecks",
        sequenceOrder: 4,
        status: "active",
        isDeleted: false,
      },  
      {
        name: "Profile",
        slug: "profile",
        icon: "RiProfileFill",
        sequenceOrder: 5,
        status: "active",
        isDeleted: false,
      },  
      {
        name: "Setting",
        slug: "setting",
        icon: "MdSettings",
        sequenceOrder: 6,
        status: "active",
        isDeleted: false,
      },   
      {
        name: "Trash",
        slug: "trash",
        icon: "FaTrashCan",
        sequenceOrder: 7,
        status: "active",
        isDeleted: false,
      },  
      
    ];

    await MenuModel.insertMany(menus);
    console.log("✅ Menu data seeded successfully");
  } catch (error) {
    console.error("❌ Seeding Menus failed:", error);
  }
};

export default seedMenus;
