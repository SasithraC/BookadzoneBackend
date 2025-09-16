import mongoose from "mongoose";
import {ENV} from "./src/config/env"
import User from "./src/models/userModel";
import bcrypt from "bcryptjs";
import app from './app';

mongoose
    .connect(ENV.MONGO_URI)
    .then(async () => {
      console.log("MongoDB Connected")
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
      app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
    })
    .catch((err) => {
      console.log("DB Connection Error: ", err)
      process.exit(1);
    });