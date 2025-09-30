import { Schema, model, Document } from "mongoose";

export interface IAgency extends Document {
  agencyName: string;
  agencyLogo: string; // path to image file
  name: string;
  photo: string; // path to image file
  position: string;
  yourEmail: string;
  yourPhone: string;
  companyEmail: string;
  companyPhone: string;
  companyRegistrationNumberGST: string;
  website: string;
  uploadIdProof: string; // path to PDF file
  uploadBusinessProof: string; // path to PDF file
  agencyAddress: string;
  agencyLocation: string;
  state: string;
  city: string;
  pincode: string;
  password: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


const agencySchema = new Schema<IAgency>({
  agencyName: { type: String, required: true },
  agencyLogo: { type: String },
  name: { type: String, required: true },
  photo: { type: String },
  position: { type: String },
  yourEmail: { type: String, required: true },
  yourPhone: { type: String, required: true },
  companyEmail: { type: String },
  companyPhone: { type: String },
  companyRegistrationNumberGST: { type: String },
  website: { type: String },
  uploadIdProof: { type: String },
  uploadBusinessProof: { type: String },
  agencyAddress: { type: String },
  agencyLocation: { type: String },
  state: { type: String },
  city: { type: String },
  pincode: { type: String },
  password: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const AgencyModel = model<IAgency>("Agency", agencySchema);