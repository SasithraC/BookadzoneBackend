import mongoose from "mongoose";
import { FooterInfoModel } from "../models/footerinfoModel";

interface IFooterInfo {
  title: string;
  content: string;
  status: "active" | "inactive";
  isDeleted: boolean;
}

const seedFooterInfos = async (): Promise<void> => {
  try {
    await FooterInfoModel.deleteMany();

    const footerInfos: IFooterInfo[] = [
      {
        title: "Contact Us",
        content: "For any inquiries, reach out to support@bookadzone.com.",
        status: "active",
        isDeleted: false,
      },
      {
        title: "Terms & Conditions",
        content: "Read the full terms and conditions for using Bookadzone services.",
        status: "active",
        isDeleted: false,
      },
      {
        title: "Privacy Policy",
        content: "Learn how your data is protected and used at Bookadzone.",
        status: "inactive",
        isDeleted: false,
      },
    ];

    await FooterInfoModel.insertMany(footerInfos);
    console.log("FooterInfo data seeded successfully");
  } catch (error) {
    console.error("Seeding FooterInfos failed:", error);
  }
};

export default seedFooterInfos;
