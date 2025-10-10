"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blogCategoryModel_1 = require("../models/blogCategoryModel");
const commonRepository_1 = require("./commonRepository");
class BlogCategoryRepository {
    constructor() {
        this.commonRepository = new commonRepository_1.CommonRepository(blogCategoryModel_1.BlogCategoryModel);
    }
    async createBlogCategory(data) {
        return await blogCategoryModel_1.BlogCategoryModel.create(data);
    }
    async getAllBlogCategories(page = 1, limit = 10, filter) {
        const query = { isDeleted: false };
        if (filter === 'active')
            query.status = 'active';
        if (filter === 'inactive')
            query.status = 'inactive';
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            blogCategoryModel_1.BlogCategoryModel.find(query).skip(skip).limit(limit),
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
    async getBlogCategoryById(id) {
        return await blogCategoryModel_1.BlogCategoryModel.findById(id);
    }
    async updateBlogCategory(id, data) {
        return await blogCategoryModel_1.BlogCategoryModel.findByIdAndUpdate(id, data, { new: true });
    }
    async softDeleteBlogCategory(id) {
        return await blogCategoryModel_1.BlogCategoryModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        // Ensure id is a string for CommonRepository
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    async restoreBlogCategory(id) {
        return await blogCategoryModel_1.BlogCategoryModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteBlogCategoryPermanently(id) {
        return await blogCategoryModel_1.BlogCategoryModel.findByIdAndDelete(id);
    }
    async getAllTrashBlogCategories(page = 1, limit = 10, filter) {
        const query = { isDeleted: true };
        if (filter === 'active')
            query.status = 'active';
        if (filter === 'inactive')
            query.status = 'inactive';
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            blogCategoryModel_1.BlogCategoryModel.find(query).skip(skip).limit(limit),
            blogCategoryModel_1.BlogCategoryModel.countDocuments(query),
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
exports.default = new BlogCategoryRepository();
