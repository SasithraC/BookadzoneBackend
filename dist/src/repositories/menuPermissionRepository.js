"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_repository_1 = require("./common.repository");
const menuPermissonModel_1 = require("../models/menuPermissonModel");
class MenuPermissionRepository {
    constructor() {
        this.commonRepository = new common_repository_1.CommonRepository(menuPermissonModel_1.MenuPermissionModel);
    }
    async createMenuPermission(data) {
        return await menuPermissonModel_1.MenuPermissionModel.create(data);
    }
    async getAllMenuPermissions(page = 1, limit = 10, filter) {
        const query = { isDeleted: false };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            menuPermissonModel_1.MenuPermissionModel.find(query).skip(skip).limit(limit),
            this.commonRepository.getStats(),
        ]);
        const totalPages = Math.ceil(stats.total / limit) || 1;
        return {
            data,
            meta: {
                ...stats,
                totalPages,
                page,
                limit,
            },
        };
    }
    async getMenuPermissionById(id) {
        return await menuPermissonModel_1.MenuPermissionModel.findById(id);
    }
    async updateMenuPermission(id, data) {
        return await menuPermissonModel_1.MenuPermissionModel.findByIdAndUpdate(id, data, { new: true });
    }
    async softDeleteMenuPermission(id) {
        return await menuPermissonModel_1.MenuPermissionModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    async getAllTrashMenuPermissions(page = 1, limit = 10, filter) {
        const query = { isDeleted: true };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            menuPermissonModel_1.MenuPermissionModel.find(query).skip(skip).limit(limit),
            menuPermissonModel_1.MenuPermissionModel.countDocuments(query),
            this.commonRepository.getStats(),
        ]);
        const totalPages = Math.max(1, Math.ceil(count / limit));
        return {
            data,
            meta: {
                ...stats,
                total: count,
                totalPages,
                page,
                limit,
            },
        };
    }
    async restoreMenuPermission(id) {
        return await menuPermissonModel_1.MenuPermissionModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteMenuPermissionPermanently(id) {
        return await menuPermissonModel_1.MenuPermissionModel.findByIdAndDelete(id);
    }
}
exports.default = new MenuPermissionRepository();
