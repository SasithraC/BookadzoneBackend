import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  photo: string;
  checkbox?: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true, maxlength: 100000  },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    checkbox: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>("CATEGORY", categorySchema);
