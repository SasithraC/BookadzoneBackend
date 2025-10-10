import mongoose, { Document } from "mongoose";
const { Schema } = mongoose;

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date ;
}

const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BlogCategoryModel = mongoose.model<IBlogCategory>("BlogCategories", blogCategorySchema);