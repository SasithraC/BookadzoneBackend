import mongoose from "mongoose";
import User from "./src/models/userModel";
import bcrypt from "bcryptjs";
import { ENV } from "./src/config/env";
beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI || "");
  const existingUser = await User.findOne({ email: "admin@gmail.com" });
  if (!existingUser) {
    await User.create({
      email: "admin@gmail.com",
      password: await bcrypt.hash("admin@123", 10),
      role: "super-admin",
      status: "active",
      isDeleted: false,
    });
  }
});


afterAll(async () => {
  await mongoose.disconnect();
});
