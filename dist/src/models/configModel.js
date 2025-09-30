"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModel = void 0;
const mongoose_1 = require("mongoose");
const configSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    configFields: [{
            key: { type: String, required: true },
            value: { type: String, required: true }
        }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.ConfigModel = (0, mongoose_1.model)("Config", configSchema);
