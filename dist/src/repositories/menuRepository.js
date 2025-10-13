"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_repository_1 = require("./common.repository");
const menuModel_1 = require("../models/menuModel");
class MenuRepository {
    constructor() {
        this.commonRepository = new common_repository_1.CommonRepository(menuModel_1.MenuModel);
    }
    async createMenu(data) {
        return await menuModel_1.MenuModel.create(data);
    }
    async getAllMenus(page = 1, limit = 10, filter) {
        const query = { isDeleted: false };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            menuModel_1.MenuModel.find(query).skip(skip).limit(limit),
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
    async getMenuById(id) {
        return await menuModel_1.MenuModel.findById(id);
    }
    async updateMenu(id, data) {
        return await menuModel_1.MenuModel.findByIdAndUpdate(id, data, { new: true });
    }
    async softDeleteMenu(id) {
        return await menuModel_1.MenuModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    async getAllTrashMenus(page = 1, limit = 10, filter) {
        const query = { isDeleted: true };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            menuModel_1.MenuModel.find(query).skip(skip).limit(limit),
            menuModel_1.MenuModel.countDocuments(query),
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
    async restoreMenu(id) {
        return await menuModel_1.MenuModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteMenuPermanently(id) {
        return await menuModel_1.MenuModel.findByIdAndDelete(id);
    }
}
exports.default = new MenuRepository();
