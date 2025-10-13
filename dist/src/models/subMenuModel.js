"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmenuModel = void 0;
const mongoose_1 = require("mongoose");
const submenuSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    mainMenuId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Menu", required: true },
    sortOrder: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.SubmenuModel = (0, mongoose_1.model)("Submenu", submenuSchema);
