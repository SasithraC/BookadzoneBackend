import mongoose from "mongoose";
import { CategoryModel } from "../models/categoryModel";

interface ICategory {
    name: string;
    slug: string;
    description: string;
    IsFeatured: string;
    status: "active" | "inactive";
    isDeleted: boolean;
}

const seedCategory = async (): Promise<void> => {
    try {
        await CategoryModel.deleteMany();

        const category: ICategory[] = [
            {
                name: "Digital Screens",
                slug: "digital-screens",
                description: "For any inquiries, reach out to support@bookadzone.com.",
                status: "active",
                IsFeatured: "true",
                isDeleted: false,
            },
            {
                name: "Wall Scape",
                slug: "wall-scape.",
                description: "Read the full terms and conditions for using Bookadzone services.",
                status: "active",
                IsFeatured: "true",
                isDeleted: false,
            },
            {
                name: "Building Wrap",
                slug: "building-wrap",
                description: "Learn how your data is protected and used at Bookadzone.",
                status: "inactive",
                IsFeatured: "true",
                isDeleted: false,
            },
        ];

        await CategoryModel.insertMany(category);
        console.log("Category data seeded successfully");
    } catch (error) {
        console.error("Seeding Category failed:", error);
    }
};

export default seedCategory;
