"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const common_service_1 = require("./common.service");
const menuRepository_1 = __importDefault(require("../repositories/menuRepository"));
const menuModel_1 = require("../models/menuModel");
class MenuService {
    constructor() {
        this.commonService = new common_service_1.CommonService(menuModel_1.MenuModel);
    }
    validateMenuData(data, isUpdate = false) {
        const rules = [
            !isUpdate
                ? validationHelper_1.default.isRequired(data.name, "name")
                : data.name !== undefined
                    ? validationHelper_1.default.isNonEmptyString(data.name, "name")
                    : null,
            data.name !== undefined ? validationHelper_1.default.maxLength(data.name, "name", 100) : null,
            !isUpdate
                ? validationHelper_1.default.isRequired(data.path, "path")
                : data.path !== undefined
                    ? validationHelper_1.default.isNonEmptyString(data.path, "path")
                    : null,
            data.path !== undefined ? validationHelper_1.default.maxLength(data.path, "path", 200) : null,
            validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"]),
            validationHelper_1.default.isBoolean(data.isDeleted, "isDeleted"),
        ];
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createMenu(data) {
        this.validateMenuData(data);
        const exists = await this.commonService.existsByField("path", data.path);
        if (exists) {
            throw new Error("Menu with this path already exists");
        }
        return await menuRepository_1.default.createMenu(data);
    }
    async getAllMenus(page = 1, limit = 10, filter) {
        return await menuRepository_1.default.getAllMenus(page, limit, filter);
    }
    async getMenuById(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuRepository_1.default.getMenuById(id);
    }
    async updateMenu(id, data) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        this.validateMenuData(data, true);
        return await menuRepository_1.default.updateMenu(id, data);
    }
    async softDeleteMenu(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuRepository_1.default.softDeleteMenu(id);
    }
    async toggleStatus(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuRepository_1.default.toggleStatus(id);
    }
    async getAllTrashMenus(page = 1, limit = 10, filter) {
        return await menuRepository_1.default.getAllTrashMenus(page, limit, filter);
    }
    async restoreMenu(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuRepository_1.default.restoreMenu(id);
    }
    async deleteMenuPermanently(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await menuRepository_1.default.deleteMenuPermanently(id);
    }
}
exports.default = new MenuService();
