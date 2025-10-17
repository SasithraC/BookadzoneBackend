import mongoose from "mongoose";
import { ENV } from "../config/env";
import seedFaqs from "./faqSeeder";
import seedConfigs from "./configSeeder";
import seedSettings from "./settingsSeeder";
import seedBlogCategories from "./blogCategorySeeder";
import seedUser from "./userSeeder";
import menuSeeder from "./menuSeeder";
import seedSubmenu from "./submenuSeeder"; 
import menuGroupSeeder from './menuGroupSeeder'
import menuPermissonSeeder from './menuPermissonSeeder';

import seedCategory from "./categorySeeder";
import seedBannerManagement from "./bannerSeeder";
import seedPages from "./pageSeeder";
const seedAll = async (): Promise<void> => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(ENV.MONGO_URI);

    console.log("Connected to MongoDB");
    // Seed in correct order - roles must come before users
    await menuSeeder();
    await seedSubmenu();
    await menuPermissonSeeder();
    await menuGroupSeeder();
    await seedUser();

    // Other seeders can run after
    // await seedFaqs();
    // await seedConfigs();
    // await seedSettings();
    // await seedCategory();
    // await seedBlogCategories();
    // await seedBannerManagement();
    // await seedPages();
    console.log("All seeders executed successfully");
    await mongoose.connection.close();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Seeding failed:", error.message);
    } else {
      console.error("Seeding failed:", error);
    }
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAll();