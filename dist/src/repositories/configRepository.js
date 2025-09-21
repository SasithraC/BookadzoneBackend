"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configModel_1 = require("../models/configModel");
const common_repository_1 = require("./common.repository");
class ConfigRepository {
    constructor() {
        this.commonRepository = new common_repository_1.CommonRepository(configModel_1.ConfigModel);
    }
    async createConfig(data) {
        return await configModel_1.ConfigModel.create(data);
    }
    async getAllConfigs(page = 1, limit = 10, filter) {
        const query = { isDeleted: false };
        if (filter === 'active')
            query.status = 'active';
        if (filter === 'inactive')
            query.status = 'inactive';
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            configModel_1.ConfigModel.find(query).skip(skip).limit(limit),
            this.commonRepository.getStats(),
        ]);
        const totalPages = Math.ceil(stats.total / limit) || 1;
        return {
            data,
            meta: {
                ...stats,
                totalPages,
                page,
                limit
            }
        };
    }
    async getConfigById(id) {
        return await configModel_1.ConfigModel.findById(id);
    }
    async updateConfig(id, data) {
        return await configModel_1.ConfigModel.findByIdAndUpdate(id, data, { new: true });
    }
    async softDeleteConfig(id) {
        return await configModel_1.ConfigModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    async restoreConfig(id) {
        return await configModel_1.ConfigModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteConfigPermanently(id) {
        return await configModel_1.ConfigModel.findByIdAndDelete(id);
    }
    async getAllTrashConfigs(page = 1, limit = 10, filter) {
        const query = { isDeleted: true };
        if (filter === 'active')
            query.status = 'active';
        if (filter === 'inactive')
            query.status = 'inactive';
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            configModel_1.ConfigModel.find(query).skip(skip).limit(limit),
            configModel_1.ConfigModel.countDocuments(query),
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
                limit
            }
        };
    }
}
exports.default = new ConfigRepository();
