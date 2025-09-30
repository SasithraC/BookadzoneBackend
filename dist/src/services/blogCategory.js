"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogCategoryRepository_1 = __importDefault(require("../repositories/blogCategoryRepository"));
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const blogCategory_1 = require("../models/blogCategory");
const common_service_1 = require("./common.service");
class BlogCategoryService {
    constructor() {
        this.commonService = new common_service_1.CommonService(blogCategory_1.blogCategoryModel);
    }
    validateCategoryData(data, isUpdate = false) {
        const rules = [
            !isUpdate
                ? validationHelper_1.default.isRequired(data.name, "name")
                : (data.name !== undefined ? validationHelper_1.default.isNonEmptyString(data.name, "name") : null),
            (data.name !== undefined ? validationHelper_1.default.maxLength(data.name, "name", 100) : null),
            validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"]),
        ];
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createCategory(data) {
        this.validateCategoryData(data);
        const exists = await this.commonService.existsByField("name", data.name);
        if (exists) {
            throw new Error("Category with this name already exists");
        }
        return await blogCategoryRepository_1.default.createCategory(data);
    }
    async getAllCategories(page = 1, limit = 10, filter) {
        return await blogCategoryRepository_1.default.getAllCategories(page, limit, filter);
    }
    async getCategoryById(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await blogCategoryRepository_1.default.getCategoryById(id);
    }
    async updateCategory(id, data) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        this.validateCategoryData(data, true);
        return await blogCategoryRepository_1.default.updateCategory(id, data);
    }
    async deleteCategory(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await blogCategoryRepository_1.default.deleteCategory(id);
    }
    async toggleStatus(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await blogCategoryRepository_1.default.toggleStatus(id);
    }
}
exports.default = new BlogCategoryService();
