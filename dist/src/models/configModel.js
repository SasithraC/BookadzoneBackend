"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const configSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    configFields: [{
            key: { type: String, required: true },
            value: { type: String, required: true }
        }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.ConfigModel = mongoose_1.default.model("Config", configSchema);
