import { SubmenuModel } from "../models/subMenuModel";
import { MenuModel } from "../models/menuModel";

const seedSubMenus = async () => {
  try {
    await SubmenuModel.deleteMany();
    console.log("🗑️ Cleared existing Submenus");

    const submenuItems = [
      // Dashboard
      { menu_slug: "dashboard", name: "Dashboard", slug: "dashboard-dashboard", path: "/", order: 1 },


      // Agency Management
      { menu_slug: "agency", name: "Agency", slug: "agency-list", path: "/agency", order: 6 },

      // Banner Management
      { menu_slug: "banner", name: "Home Banners", slug: "banner-home", path: "/banner/homepage", order: 8 },
      { menu_slug: "banner", name: "About Banner", slug: "banner-about", path: "/banner/about", order: 9 },

      // Site Setting
      { menu_slug: "site-setting", name: "FAQ", slug: "site-setting-faq", path: "/faq", order: 10 },
      { menu_slug: "site-setting", name: "Newsletter", slug: "site-setting-newsletter", path: "/newsletter", order: 11 },
      { menu_slug: "site-setting", name: "Footer Info", slug: "site-setting-footerinfo", path: "/footerinfo", order: 12 },
      { menu_slug: "site-setting", name: "Config", slug: "site-setting-config", path: "/config", order: 13 },
      { menu_slug: "site-setting", name: "Blog Category", slug: "site-setting-blogcategory", path: "/blogcategory", order: 14 },
      { menu_slug: "site-setting", name: "Category", slug: "site-setting-category", path: "/category", order: 15 },

      // Setting
      { menu_slug: "setting", name: "General Settings", slug: "settings-general", path: "/settings/general", order: 16 },
      { menu_slug: "setting", name: "Contact Info", slug: "settings-contact", path: "/settings/contact", order: 17 },
      { menu_slug: "setting", name: "Email Configuration", slug: "settings-email", path: "/settings/email", order: 18 },
      { menu_slug: "setting", name: "SEO Configuration", slug: "settings-seo", path: "/settings/seo", order: 19 },
      { menu_slug: "setting", name: "OG Configuration", slug: "settings-og", path: "/settings/og", order: 20 },
      { menu_slug: "setting", name: "User Role", slug: "settings-userrole", path: "/userrole", order: 21 },

      // Profile
      { menu_slug: "profile", name: "Update Profile", slug: "profile-update", path: "/profile/update", order: 22 },
      { menu_slug: "profile", name: "Change Password", slug: "profile-password", path: "/profile/change-password", order: 23 },

      // Trash
      { menu_slug: "trash", name: "Agency", slug: "trash-agency", path: "/trash/agency", order: 24 },
      { menu_slug: "trash", name: "FAQ", slug: "trash-faq", path: "/trash/faq", order: 25 },
      { menu_slug: "trash", name: "Newsletter", slug: "trash-newsletter", path: "/trash/newsletter", order: 26 },
      { menu_slug: "trash", name: "Footer Info", slug: "trash-footerinfo", path: "/trash/footerinfo", order: 27 },
      { menu_slug: "trash", name: "Config", slug: "trash-config", path: "/trash/config", order: 28 },
      { menu_slug: "trash", name: "Blog Category", slug: "trash-blogcategory", path: "/trash/blogcategory", order: 29 },
      { menu_slug: "trash", name: "Category", slug: "trash-category", path: "/trash/category", order: 30 },
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
