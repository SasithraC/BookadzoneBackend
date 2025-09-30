import { Schema, model, Document } from "mongoose";

export interface IPage extends Document {
  title: string; // Select field (values from config)
  name: string;
  slug: string;
  type: "link" | "template";
  url?: string;
  description?: string; 
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const pageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true }, 
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ["link", "template"], required: true },
    url: { type: String }, 
    description: { type: String }, 
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PageModel = model<IPage>("Page", pageSchema);
