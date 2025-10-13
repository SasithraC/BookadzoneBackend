"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_repository_1 = require("./common.repository");
const menuGroupModel_1 = require("../models/menuGroupModel");
class GroupRepository {
    constructor() {
        this.commonRepository = new common_repository_1.CommonRepository(menuGroupModel_1.GroupModel);
    }
    async createGroup(data) {
        return await menuGroupModel_1.GroupModel.create(data);
    }
    async getAllGroups(page = 1, limit = 10, filter) {
        const query = { isDeleted: false };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            menuGroupModel_1.GroupModel.find(query).skip(skip).limit(limit),
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
    async getGroupById(id) {
        return await menuGroupModel_1.GroupModel.findById(id);
    }
    async updateGroup(id, data) {
        return await menuGroupModel_1.GroupModel.findByIdAndUpdate(id, data, { new: true });
    }
    async softDeleteGroup(id) {
        return await menuGroupModel_1.GroupModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    async getAllTrashGroups(page = 1, limit = 10, filter) {
        const query = { isDeleted: true };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            menuGroupModel_1.GroupModel.find(query).skip(skip).limit(limit),
            menuGroupModel_1.GroupModel.countDocuments(query),
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
    async restoreGroup(id) {
        return await menuGroupModel_1.GroupModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteGroupPermanently(id) {
        return await menuGroupModel_1.GroupModel.findByIdAndDelete(id);
    }
}
exports.default = new GroupRepository();
