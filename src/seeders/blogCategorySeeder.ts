import { BlogCategoryModel } from "../models/blogCategoryModel";

// BlogCategory type optional ah define panniradhu
interface IBlogCategory {
  name: string;
  status: "active" | "inactive";
  isDeleted: boolean;
}

const seedBlogCategories = async (): Promise<void> => {
  try {
    // Old blog categories remove pannidum
    await BlogCategoryModel.deleteMany();

    const categories: IBlogCategory[] = [
      {
        name: "Outdoor Advertising",
        status: "active",
        isDeleted: false,
      },
      {
        name: "Digital Marketing",
        status: "active",
        isDeleted: false,
      },
      {
        name: "Billboard Design Tips",
        status: "inactive",
        isDeleted: false,
      },
    ];

    await BlogCategoryModel.insertMany(categories);
    console.log("✅ Blog categories seeded successfully");
  } catch (error) {
    console.error("❌ Seeding BlogCategories failed:", error);
  }
};

export default seedBlogCategories;
