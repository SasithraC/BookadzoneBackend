import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  roleId: Types.ObjectId;
  rolePrivilegeIds: Types.ObjectId[]; 
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    rolePrivilegeIds: [{ type: Schema.Types.ObjectId, ref: "RolePrivilege" }], 
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;