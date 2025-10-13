import { BlogCategoryModel } from "../models/blogCategoryModel";

// BlogCategory type optional ah define panniradhu
interface IBlogCategory {
  name: string;
  slug: string;
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
        slug: "outdoor-advertising",
        status: "active",
        isDeleted: false,
      },
      {
        name: "Digital Marketing",
        slug: "digital-marketing",
        status: "active",
        isDeleted: false,
      },
      {
        name: "Billboard Design Tips",
        slug: "billboard-design-tips",
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
