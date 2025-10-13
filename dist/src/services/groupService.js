"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const common_service_1 = require("./common.service");
const grouprepository_1 = __importDefault(require("../repositories/grouprepository"));
const menuGroupModel_1 = require("../models/menuGroupModel");
class GroupService {
    constructor() {
        this.commonService = new common_service_1.CommonService(menuGroupModel_1.GroupModel);
    }
    validateGroupData(data, isUpdate = false) {
        const rules = [
            !isUpdate
                ? validationHelper_1.default.isRequired(data.roles, "roles")
                : data.roles !== undefined
                    ? validationHelper_1.default.isNonEmptyArray(data.roles, "roles")
                    : null,
            data.roles !== undefined ? validationHelper_1.default.isValidArrayOfObjectIds(data.roles, "roles") : null,
            !isUpdate
                ? validationHelper_1.default.isRequired(data.menuPermissions, "menuPermissions")
                : data.menuPermissions !== undefined
                    ? validationHelper_1.default.isNonEmptyArray(data.menuPermissions, "menuPermissions")
                    : null,
            data.menuPermissions !== undefined
                ? validationHelper_1.default.isValidArrayOfObjectIds(data.menuPermissions, "menuPermissions")
                : null,
            !isUpdate
                ? validationHelper_1.default.isRequired(data.menus, "menus")
                : data.menus !== undefined
                    ? validationHelper_1.default.isNonEmptyArray(data.menus, "menus")
                    : null,
            data.menus !== undefined ? validationHelper_1.default.isValidArrayOfObjectIds(data.menus, "menus") : null,
            validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"]),
            validationHelper_1.default.isBoolean(data.isDeleted, "isDeleted"),
        ];
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createGroup(data) {
        this.validateGroupData(data);
        return await grouprepository_1.default.createGroup(data);
    }
    async getAllGroups(page = 1, limit = 10, filter) {
        return await grouprepository_1.default.getAllGroups(page, limit, filter);
    }
    async getGroupById(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await grouprepository_1.default.getGroupById(id);
    }
    async updateGroup(id, data) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        this.validateGroupData(data, true);
        return await grouprepository_1.default.updateGroup(id, data);
    }
    async softDeleteGroup(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await grouprepository_1.default.softDeleteGroup(id);
    }
    async toggleStatus(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await grouprepository_1.default.toggleStatus(id);
    }
    async getAllTrashGroups(page = 1, limit = 10, filter) {
        return await grouprepository_1.default.getAllTrashGroups(page, limit, filter);
    }
    async restoreGroup(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await grouprepository_1.default.restoreGroup(id);
    }
    async deleteGroupPermanently(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await grouprepository_1.default.deleteGroupPermanently(id);
    }
}
exports.default = new GroupService();
