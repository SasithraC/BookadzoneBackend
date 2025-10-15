import { SubmenuModel } from "../models/subMenuModel";
import { MenuModel } from "../models/menuModel";

const seedSubMenus = async () => {
  try {
    await SubmenuModel.deleteMany();
    console.log("🗑️ Cleared existing Submenus");

    const submenuItems = [
      // Dashboard
      { menu_slug: "dashboard", name: "Dashboard", slug: "dashboard-dashboard", path: "/", order: 1 },

      // Site Setting
      { menu_slug: "site-setting", name: "FAQ", slug: "site-setting-faq", path: "/faq", order: 2 },
      { menu_slug: "site-setting", name: "Config", slug: "site-setting-config", path: "/config", order: 3 },

      // Setting
      { menu_slug: "setting", name: "FooterInfo", slug: "setting-footerinfo", path: "/footerinfo", order: 4 },
      { menu_slug: "setting", name: "General Settings", slug: "settings-general", path: "/settings/general", order: 5 },
      { menu_slug: "setting", name: "Contact Info", slug: "settings-contact", path: "/settings/contact", order: 6 },
      { menu_slug: "setting", name: "Email Configuration", slug: "settings-email", path: "/settings/email", order: 7 },
      { menu_slug: "setting", name: "SEO Configuration", slug: "settings-seo", path: "/settings/seo", order: 8 },
      { menu_slug: "setting", name: "OG Configuration", slug: "settings-og", path: "/settings/og", order: 9 },
      { menu_slug: "setting", name: "User Role", slug: "settings-userrole", path: "/userrole", order: 10 },

      // Trash
      { menu_slug: "trash", name: "FAQ", slug: "trash-faq", path: "/trash/faq", order: 11 },
      { menu_slug: "trash", name: "FooterInfo", slug: "trash-footerinfo", path: "/trash/footerinfo", order: 12 },
      { menu_slug: "trash", name: "Config", slug: "trash-config", path: "/trash/config", order: 13 },
    ];

    const submenuData = [];
    for (const item of submenuItems) {
      const mainMenu = await MenuModel.findOne({ slug: item.menu_slug, isDeleted: false });
      if (!mainMenu) {
        console.error(`❌ Main menu with slug "${item.menu_slug}" not found.`);
        continue;
      }
      submenuData.push({
        name: item.name,
        slug: item.slug,
        path: item.path,
        mainMenuId: mainMenu._id,
        sortOrder: item.order,
        status: "active",
        isDeleted: false,
      });
    }

    const insertedSubmenus = await SubmenuModel.insertMany(submenuData);
    console.log(`✅ Seeded Submenus: ${insertedSubmenus.length}`);
    return insertedSubmenus;
  } catch (err) {
    console.error("❌ Error seeding Submenus:", err);
    throw err;
  }
};

export default seedSubMenus;
