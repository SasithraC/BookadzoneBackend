import mongoose, { Document, Schema } from "mongoose";

export interface IUser  extends Document {
    email: string;
    password: string;
    role: "super-admin" | "admin";
    status: "active" | "inactive";
    isDeleted: boolean;
}

const userSchema: Schema<IUser> = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["super-admin", "admin"], default: "super-admin" },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("users", userSchema);

export default User;

