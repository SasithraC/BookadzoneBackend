"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModel = void 0;
const mongoose_1 = require("mongoose");
const menuSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    sortOrder: { type: Number, required: true, default: 0 },
    icon: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.MenuModel = (0, mongoose_1.model)("Menu", menuSchema);
