import { Schema, model, Document } from "mongoose";

export interface IBlogsModel extends Document {
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
  length:any;
}

const blogsModelSchema = new Schema<IBlogsModel>(
  {
    blogTitle: { type: String, required: true },
    seoTitle: { type: String, required: true },
    seoDescription: { type: String, required: true },
    blogCategory: { type: String, required: true },
    blogDescription: { type: String, required: false, default: "" },
    blogImg: { type: String, required: false, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
    length: { type: Number, default: false },

  },
  { timestamps: true }
);

export const BlogsModel = model<IBlogsModel>("Blogs", blogsModelSchema);
