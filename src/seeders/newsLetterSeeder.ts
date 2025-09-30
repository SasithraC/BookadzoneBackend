import mongoose from "mongoose";
import { NewsLetter } from "../models/newsLettermodel";

// NewsLetter type optional ah define panna
interface INewsLetter {
  name: string;
  slug: string;
  template:string
  status: "active" | "inactive";
  isDeleted: boolean;
}

const seedNewsLetters = async (): Promise<void> => {
  try {
    await NewsLetter.deleteMany();

    const newsLetters: INewsLetter[] = [
      {
        name: "Monthly Tech Newsletter",
        slug: "monthly-tech-newsletter",
        template: "<h1>Welcome to our Monthly Tech Newsletter!</h1><p>Stay updated with the latest tech trends, news, and tutorials delivered straight to your inbox.</p>",
        status: "active",
        isDeleted: false,
      },
      {
        name: "Weekly Marketing Digest",
        slug: "weekly-marketing-digest",
        template: "<h2>This Week in Marketing</h2><p>Get the top marketing tips, campaign strategies, and case studies delivered every week.</p>",
        status: "active",
        isDeleted: false,
      },
      {
        name: "Startup Growth Newsletter",
        slug: "startup-growth-newsletter",
        template: "<h1>Grow Your Startup</h1><p>Insights, resources, and growth hacks for early-stage founders. Stay ahead with our curated startup content.</p>",
        status: "inactive",
        isDeleted: false,
      }
    ];

    await NewsLetter.insertMany(newsLetters);
    console.log(" NewsLetter data seeded successfully");
  } catch (error) {
    console.error("Seeding NewsLetters failed:", error);
  }
};

export default seedNewsLetters;
