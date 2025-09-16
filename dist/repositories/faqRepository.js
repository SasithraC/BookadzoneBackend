"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faqModel_1 = require("../models/faqModel");
const common_repository_1 = require("./common.repository");
class FaqRepository {
    constructor() {
        this.commonRepository = new common_repository_1.CommonRepository(faqModel_1.FaqModel);
    }
    async createFaq(data) {
        return await faqModel_1.FaqModel.create(data);
    }
    async getAllFaqs(page = 1, limit = 10, filter) {
        const query = { isDeleted: false };
        if (filter === 'active')
            query.status = 'active';
        if (filter === 'inactive')
            query.status = 'inactive';
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            faqModel_1.FaqModel.find(query).skip(skip).limit(limit),
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
    async getFaqById(id) {
        return await faqModel_1.FaqModel.findById(id);
    }
    async updateFaq(id, data) {
        return await faqModel_1.FaqModel.findByIdAndUpdate(id, data, { new: true });
    }
    async softDeleteFaq(id) {
        return await faqModel_1.FaqModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        // Ensure id is a string for CommonRepository
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    async restoreFaq(id) {
        return await faqModel_1.FaqModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteFaqPermanently(id) {
        return await faqModel_1.FaqModel.findByIdAndDelete(id);
    }
    async getAllTrashFaqs(page = 1, limit = 10, filter) {
        const query = { isDeleted: true };
        if (filter === 'active')
            query.status = 'active';
        if (filter === 'inactive')
            query.status = 'inactive';
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            faqModel_1.FaqModel.find(query).skip(skip).limit(limit),
            faqModel_1.FaqModel.countDocuments(query),
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
exports.default = new FaqRepository();
