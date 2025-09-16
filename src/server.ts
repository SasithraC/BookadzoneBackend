import app from "./app";
import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bookadzone";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});