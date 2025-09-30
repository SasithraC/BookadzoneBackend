"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const footerinfoModel_1 = require("../models/footerinfoModel");
const common_repository_1 = require("./common.repository");
class FooterInfoRepository {
    constructor() {
        this.commonRepository = new common_repository_1.CommonRepository(footerinfoModel_1.FooterInfoModel);
    }
    async createFooterInfo(data) {
        return await footerinfoModel_1.FooterInfoModel.create(data);
    }
    async getFooterInfo(page = 1, limit = 10, filter) {
        const query = { isDeleted: false };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            footerinfoModel_1.FooterInfoModel.find(query).skip(skip).limit(limit),
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
    async getFooterInfoById(id) {
        return await footerinfoModel_1.FooterInfoModel.findById(id);
    }
    async updateFooterInfo(id, data) {
        return await footerinfoModel_1.FooterInfoModel.findByIdAndUpdate(id, data, { new: true });
    }
    async softDeleteFooterInfo(id) {
        return await footerinfoModel_1.FooterInfoModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    async restoreFooterInfo(id) {
        return await footerinfoModel_1.FooterInfoModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteFooterInfoPermanently(id) {
        return await footerinfoModel_1.FooterInfoModel.findByIdAndDelete(id);
    }
    async getAllTrashFooterInfos(page = 1, limit = 10, filter) {
        const query = { isDeleted: true };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            footerinfoModel_1.FooterInfoModel.find(query).skip(skip).limit(limit),
            footerinfoModel_1.FooterInfoModel.countDocuments(query),
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
}
exports.default = new FooterInfoRepository();
