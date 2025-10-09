import mongoose from "mongoose";
import { BlogsModel } from "../models/blogsModel";

interface IBlogs {
  blogTitle: string;
  blogCategory: string;
  blogDescription: string;
  blogImg: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
  length?: number;
}

const seedBlog = async (): Promise<void> => {
  try {
    await BlogsModel.deleteMany();

    const blogs: IBlogs[] = [
      {
        blogTitle: "Digital Screens Advertising Revolution",
        blogCategory: "Digital Marketing",
        blogDescription:
          "Discover how digital screens are transforming the advertising landscape with interactive and dynamic visuals.",
        blogImg: "https://cdn.bookadzone.com/blogs/digital-screens.jpg",
        status: "active",
        isDeleted: false,
        seoTitle: "digital-screens-advertising",
        seoDescription:
          "Explore the impact of digital screen advertising on brand engagement and consumer behavior.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        blogTitle: "The Rise of Wall Scape Advertising",
        blogCategory: "Outdoor Marketing",
        blogDescription:
          "Wall scapes are taking over urban environments, turning city walls into massive advertising opportunities.",
        blogImg: "https://cdn.bookadzone.com/blogs/wall-scape.jpg",
        status: "active",
        isDeleted: false,
        seoTitle: "wall-scape-advertising",
        seoDescription:
          "Learn how wall scape advertising enhances brand visibility and leaves lasting impressions.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        blogTitle: "Building Wrap Campaigns Explained",
        blogCategory: "OOH Advertising",
        blogDescription:
          "Building wraps are the next big thing in outdoor advertising, offering unmatched visibility in high-traffic areas.",
        blogImg: "https://cdn.bookadzone.com/blogs/building-wrap.jpg",
        status: "inactive",
        isDeleted: false,
        seoTitle: "building-wrap-campaigns",
        seoDescription:
          "Understand the benefits of large-scale building wrap advertisements and how they drive brand awareness.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await BlogsModel.insertMany(blogs);
    console.log("✅ Blog data seeded successfully");
  } catch (error) {
    console.error("❌ Seeding Blog failed:", error);
  }
};

export default seedBlog;

