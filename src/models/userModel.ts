import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    roleId: Types.ObjectId;
    rolePrivilegeIds: Types.ObjectId[];
    status: "active" | "inactive";
    isDeleted: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
        rolePrivilegeIds: [{ type: Schema.Types.ObjectId, ref: "RolePrivilege" }],
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isDeleted: { type: Boolean, default: false },
         resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    { timestamps: true }
);

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Add password comparison method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const User = mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;