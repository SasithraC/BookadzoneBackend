"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
const mongoose_1 = require("mongoose");
const userPrivilegeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    menuGroupId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Group", required: true },
    status: { type: Boolean, default: false },
}, { timestamps: true });
exports.RoleModel = (0, mongoose_1.model)("UserPrivileges", userPrivilegeSchema);
