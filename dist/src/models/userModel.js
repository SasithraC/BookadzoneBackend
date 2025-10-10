"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["super-admin", "admin", "agency"], default: "super-admin" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const User = (0, mongoose_1.model)("users", userSchema);
exports.default = User;
