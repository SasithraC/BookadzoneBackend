"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogCategoryModel = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ["avtive", "inactive"], default: "active" }
}, { timestamps: true });
exports.blogCategoryModel = (0, mongoose_1.model)("Blog", blogSchema);
