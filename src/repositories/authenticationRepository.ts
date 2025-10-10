import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { sign, verify, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { Document } from "mongoose";

export interface IAuthLoginInput {
  email: string;
  password: string;
}

interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

class AuthenticationRepository {
  async updateUser(userId: string, data: { email?: string, password?: string, role?: string, status?: string, isDeleted?: boolean }) {
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (typeof data.password !== 'undefined' && data.password !== '') {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.role) updateData.role = data.role;
    if (data.status) updateData.status = data.status;
    if (typeof data.isDeleted !== 'undefined') updateData.isDeleted = data.isDeleted;
    // Always update user by userId, even if only email is present
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return user ? user.toObject() : null;
  }
  async authLogin(data: IAuthLoginInput): Promise<{ token: string; data: Partial<IUser>; expiresIn: StringValue }> {
    const { email, password } = data;

    const user = await User
      .findOne({ email })
      .select("_id email password role status")
      .lean<IUser>();

    if (!user) {
      throw new Error("Email does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password for user");
    }

    return this._generateToken(user);
  }

  async refreshToken(token: string): Promise<{ token: string; data: Partial<IUser>; expiresIn: StringValue }> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not defined in environment");
    }
    let decoded: any;
    try {
      decoded = verify(token, jwtSecret);
    } catch (err: any) {
      throw new Error("Invalid or expired token");
    }
    const userId = decoded._id || decoded.id;
    const user = await User.findOne({ _id: userId }).select("_id email role status").lean<IUser>();
    if (!user) {
      throw new Error("User not found");
    }
    return this._generateToken(user);
  }

  private _generateToken(user: IUser): { token: string; data: Partial<IUser>; expiresIn: StringValue } {
    const jwtSecret = process.env.JWT_SECRET;
    const validExpireTimes = ["1d", "2d", "1h", "2h", "30m", "1m"];
    const expiresIn = process.env.JWT_EXPIRE_TIME && validExpireTimes.includes(process.env.JWT_EXPIRE_TIME)
      ? process.env.JWT_EXPIRE_TIME
      : "1d";
    const signOptions: SignOptions = {
      expiresIn: expiresIn as StringValue,
    };
    const token = sign(
      { _id: user._id, id: user._id, email: user.email, role: user.role },
      jwtSecret!,
      signOptions
    );
    const { password: _, ...userWithoutPassword } = user;
    return { token, data: userWithoutPassword, expiresIn: expiresIn as StringValue };
  }

  async createUser(data: { email: string, password: string, role: string, status: string, isDeleted: boolean }) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = {
      ...data,
      password: hashedPassword,
    };
    // Create the new user with the hashed password
    const user = await User.create(userData);
    return user;
  }

  async getUserById(id: string) {
    return await User.findById(id);
  }

  async checkEmailExists(email: string, currentUserId?: string | null): Promise<boolean> {
    const query: any = { 
      email, 
      isDeleted: false 
    };
    // Exclude current user from the check if currentUserId is provided
    if (currentUserId) {
      query._id = { $ne: currentUserId };
    }
    const exists = await User.findOne(query);
    return !!exists;
  }

  async deleteUserPermanently(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }

  }


export default new AuthenticationRepository();