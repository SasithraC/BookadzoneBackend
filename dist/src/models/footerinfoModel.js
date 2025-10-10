"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterInfoModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const footerInfoSchema = new Schema({
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
exports.FooterInfoModel = mongoose_1.default.model("FooterInfo", footerInfoSchema);
