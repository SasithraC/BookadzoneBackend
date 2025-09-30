"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqModel = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.FaqModel = (0, mongoose_1.model)("FAQ", faqSchema);
