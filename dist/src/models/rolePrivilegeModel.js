"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePrivilgeModel = void 0;
const mongoose_1 = require("mongoose");
const rolePrivilegeSchema = new mongoose_1.Schema({
    roleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Role", required: true },
    menuGroupId: { type: mongoose_1.Schema.Types.ObjectId, ref: "MenuGroup", required: true },
    status: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.RolePrivilgeModel = (0, mongoose_1.model)("RolePrivilege", rolePrivilegeSchema);
