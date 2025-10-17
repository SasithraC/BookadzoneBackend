// agencyModel.ts
import mongoose,{ Document, Schema, Types } from "mongoose";

export interface IAgency extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Required in schema
  yourEmail?: string; // Changed from 'any' to reflect user email
  agencyName: string;
  agencyLogo?: string; // Optional, as not required in schema
  name: string;
  photo?: string;
  position?: string;
  yourPhone: string;
  companyEmail?: string;
  companyPhone?: string;
  companyRegistrationNumberGST?: string;
  website?: string;
  uploadIdProof?: string;
  uploadBusinessProof?: string;
  agencyAddress?: string;
  agencyLocation?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILeanAgency extends Omit<IAgency, '_id' | 'userId'> {
  _id: string;
  userId: string; // Aggregation converts ObjectId to string, required
  yourEmail?: string;
  __v?: number; // Include Mongoose version key
}

const agencySchema = new Schema<IAgency>({
  agencyName: { type: String, required: [true, 'Agency name is required'] },
  agencyLogo: { type: String },
  name: { type: String, required: [true, 'Name is required'] },
  photo: { type: String },
  position: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: [true, 'User ID is required'] },
  yourPhone: { type: String, required: [true, 'Your phone is required'] },
  companyEmail: { type: String },
  companyPhone: { type: String },
  companyRegistrationNumberGST: { type: String },
  website: { type: String },
  uploadIdProof: { type: String },
  uploadBusinessProof: { type: String },
  agencyAddress: { type: String },
  agencyLocation: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  pincode: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

agencySchema.index(
  { companyEmail: 1 }, 
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { isDeleted: false, companyEmail: { $exists: true, $ne: "" } }
  }
);

agencySchema.index({ userId: 1, isDeleted: 1 }, { 
  unique: true,
  partialFilterExpression: { isDeleted: false }
});

const AgencyModel = mongoose.model<IAgency>("Agency", agencySchema);
export default AgencyModel;