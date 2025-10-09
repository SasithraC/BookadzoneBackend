import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
  photo: string;
  isFeatured: boolean;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  length:any;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: false, default: "" },
    photo: { type: String, required: false, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    length: { type: Number, default: false },

  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>("Category", categorySchema);
