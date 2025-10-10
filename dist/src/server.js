"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./config/env");
const mongoUri = env_1.ENV.MONGO_URI || "mongodb://localhost:27017/bookadzone";
mongoose_1.default
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected to:", mongoUri))
    .catch((err) => console.error("MongoDB connection error:", err));
const PORT = env_1.ENV.PORT;
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
