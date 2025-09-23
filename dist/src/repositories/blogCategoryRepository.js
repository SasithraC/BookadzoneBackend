"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blogCategory_1 = require("../models/blogCategory");
class BlogCategoryRepository {
    async createCategory(data) {
        return await blogCategory_1.blogCategoryModel.create(data);
    }
    async getAllCategories(page = 1, limit = 10, filter) {
        const query = {};
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            blogCategory_1.blogCategoryModel.find(query).skip(skip).limit(limit),
            blogCategory_1.blogCategoryModel.countDocuments(query),
        ]);
        const totalPages = Math.max(1, Math.ceil(total / limit));
        return {
            data,
            meta: {
                total,
                totalPages,
                page,
                limit,
            },
        };
    }
    async getCategoryById(id) {
        return await blogCategory_1.blogCategoryModel.findById(id);
    }
    async updateCategory(id, data) {
        return await blogCategory_1.blogCategoryModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteCategory(id) {
        return await blogCategory_1.blogCategoryModel.findByIdAndDelete(id);
    }
    async toggleStatus(id) {
        const category = await blogCategory_1.blogCategoryModel.findById(id);
        if (!category)
            return null;
        category.status = category.status === "active" ? "inactive" : "active";
        await category.save();
        return category;
    }
}
exports.default = new BlogCategoryRepository();
