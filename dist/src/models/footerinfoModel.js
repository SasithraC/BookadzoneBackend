"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterInfoModel = void 0;
const mongoose_1 = require("mongoose");
const footerInfoSchema = new mongoose_1.Schema({
    logo: { type: String, required: true },
    description: { type: String, required: true },
    socialmedia: { type: String, required: false, default: "" },
    socialmedialinks: { type: String, required: false, default: "" },
    google: { type: String, required: false, default: "" },
    appstore: { type: String, required: false, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    priority: { type: Number, required: true, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.FooterInfoModel = (0, mongoose_1.model)("FooterInfo", footerInfoSchema);
