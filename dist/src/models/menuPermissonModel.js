"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuPermissionModel = void 0;
const mongoose_1 = require("mongoose");
const menuPermissionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.MenuPermissionModel = (0, mongoose_1.model)("MenuPermission", menuPermissionSchema);
