import mongoose, { Document } from "mongoose";
const { Schema } = mongoose;

export interface IFooterInfo extends Document {
  logo: string;
  description: string;
  socialmedia: string;
  socialmedialinks: string;
  google: string;
  appstore: string;
  status: "active" | "inactive";
  priority: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const footerInfoSchema = new Schema<IFooterInfo>(
  {
    logo: { type: String, required: true },
    description: { type: String, required: true },
    socialmedia: { type: String, required: false, default: "" },
    socialmedialinks: { type: String, required: false, default: "" },
    google: { type: String, required: false, default: "" },
    appstore: { type: String, required: false, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    priority: { type: Number, required: true, default: 1 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FooterInfoModel = mongoose.model<IFooterInfo>("FooterInfo", footerInfoSchema);