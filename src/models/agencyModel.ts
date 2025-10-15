import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAgency extends Document {
  yourEmail: any;
  agencyName: string;
  agencyLogo: string;
  name: string;
  photo: string;
  position: string;
  userId: Types.ObjectId;  
  yourPhone: string;
  companyEmail: string;
  companyPhone: string;
  companyRegistrationNumberGST: string;
  website: string;
  uploadIdProof: string;
  uploadBusinessProof: string;
  agencyAddress: string;
  agencyLocation: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const agencySchema = new Schema<IAgency>({
  agencyName: { type: String, required: [true, 'Agency name is required'] },
  agencyLogo: { type: String },
  name: { type: String, required: [true, 'Name is required'] },
  photo: { type: String },
  position: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: [true, 'User ID is required'] },
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

// Add compound indexes for unique constraints
agencySchema.index({ companyEmail: 1, isDeleted: 1 }, { 
  unique: true,
  sparse: true,
  partialFilterExpression: { isDeleted: false, companyEmail: { $exists: true, $ne: "" } }
});

agencySchema.index({ userId: 1, isDeleted: 1 }, { 
  unique: true,
  partialFilterExpression: { isDeleted: false }
});

const AgencyModel = mongoose.model<IAgency>("Agency", agencySchema);
export default AgencyModel;