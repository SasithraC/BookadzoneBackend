"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupModel = void 0;
const mongoose_1 = require("mongoose");
const menuGroupSchema = new mongoose_1.Schema({
    submenuId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Submenu", default: null },
    menuPermissionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "MenuPermission", default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.GroupModel = (0, mongoose_1.model)("MenuGroup", menuGroupSchema);
