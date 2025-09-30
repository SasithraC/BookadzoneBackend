import mongoose from "mongoose";
import { PageModel } from "../models/pageModel";

// Faq type optional ah define panna
interface IPage {
  title: string;
  name: string;
  slug: string;
  type: "link" | "template";
  url?: string;
  description?: string; 
  status: "active" | "inactive";
  isDeleted: boolean;
}

const seedPages = async (): Promise<void> => {
  try {
    await PageModel.deleteMany();

    const pages: IPage[] = [
      {
        title: "Home",
        name: "Homepage",
        slug: "home-page",
        type: "link",
        url: "https://bookadzone.com/home",
        description: "Welcome to Bookadzone homepage.",
        status: "active",
        isDeleted: false,
      },
      {
        title: "Contact Us",
        name: "Contact",
        slug: "contact-us",
        type: "link",
        url: "https://bookadzone.com/contact",
        description: "Contact Bookadzone for support and inquiries.",
        status: "active",
        isDeleted: false,
      },
     {
        title: "About Bookadzone",
        name: "About",
        slug: "about-bookadzone",
        type: "template",
        url: "",
        description: "Learn more about Bookadzone and our services.",
        status: "inactive",
        isDeleted: false,
      },
    ];

    await PageModel.insertMany(pages);
    console.log("Pages data seeded successfully");
  } catch (error) {
    console.error("Seeding Pages failed:", error);
  }
};

export default seedPages;
