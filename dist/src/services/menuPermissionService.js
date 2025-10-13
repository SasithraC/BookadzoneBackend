"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const common_service_1 = require("./common.service");
const menuPermissionRepository_1 = __importDefault(require("../repositories/menuPermissionRepository"));
const menuPermissonModel_1 = require("../models/menuPermissonModel"); // Fixed typo
class MenuPermissionService {
    constructor() {
        this.commonService = new common_service_1.CommonService(menuPermissonModel_1.MenuPermissionModel);
    }
    validateMenuPermissionData(data, isUpdate = false) {
        const rules = [
            // Validate menuId
            !isUpdate
                ? validationHelper_1.default.isRequired(data.menuId, "menuId")
                : data.menuId !== undefined
                    ? validationHelper_1.default.isValidObjectId(data.menuId, "menuId")
                    : null,
            // Validate permissions
            !isUpdate
                ? validationHelper_1.default.isRequired(data.permissions, "permissions")
                : data.permissions !== undefined
                    ? validationHelper_1.default.isNonEmptyArray(data.permissions, "permissions")
                    : null,
            data.permissions !== undefined
                ? validationHelper_1.default.isValidArrayOfStrings(data.permissions, "permissions")
                : null,
            // Validate status
            data.status !== undefined
                ? validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"])
                : null,
            // Validate isDeleted
            data.isDeleted !== undefined ? validationHelper_1.default.isBoolean(data.isDeleted, "isDeleted") : null,
        ];
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createMenuPermission(data) {
        this.validateMenuPermissionData(data);
        const exists = await this.commonService.existsByField("menuId", data.menuId);
        if (exists) {
            throw new Error("Menu permission for this menu already exists");
        }
        return await menuPermissionRepository_1.default.createMenuPermission(data);
    }
    async getAllMenuPermissions(page = 1, limit = 10, filter) {
        return await menuPermissionRepository_1.default.getAllMenuPermissions(page, limit, filter);
    }
    async getMenuPermissionById(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuPermissionRepository_1.default.getMenuPermissionById(id);
    }
    async updateMenuPermission(id, data) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        this.validateMenuPermissionData(data, true);
        return await menuPermissionRepository_1.default.updateMenuPermission(id, data);
    }
    async softDeleteMenuPermission(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuPermissionRepository_1.default.softDeleteMenuPermission(id);
    }
    async toggleStatus(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuPermissionRepository_1.default.toggleStatus(id);
    }
    async getAllTrashMenuPermissions(page = 1, limit = 10, filter) {
        return await menuPermissionRepository_1.default.getAllTrashMenuPermissions(page, limit, filter);
    }
    async restoreMenuPermission(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuPermissionRepository_1.default.restoreMenuPermission(id);
    }
    async deleteMenuPermissionPermanently(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuPermissionRepository_1.default.deleteMenuPermissionPermanently(id);
    }
}
exports.default = new MenuPermissionService();
