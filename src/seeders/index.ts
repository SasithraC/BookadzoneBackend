import mongoose from "mongoose";
import { ENV } from "../config/env";
import seedFaqs from "./faqSeeder";
import seedConfigs from "./configSeeder";
import seedSettings from "./settingsSeeder"
import seedBlogCategories from "./blogCategorySeeder";

const seedAll = async (): Promise<void> => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(ENV.MONGO_URI);

    console.log("Connected to MongoDB");
  await seedFaqs();
  await seedConfigs();
  await seedSettings();
  await seedBlogCategories();
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