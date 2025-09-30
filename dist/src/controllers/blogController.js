"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogCategory_1 = __importDefault(require("../services/blogCategory"));
const httpResponse_1 = require("../utils/httpResponse");
class BlogCategoryController {
    async createCategory(req, res, next) {
        console.log('=================req', req, res);
        try {
            const category = await blogCategory_1.default.createCategory(req.body);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Category created", data: category });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async getAllCategories(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await blogCategory_1.default.getAllCategories(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async getCategoryById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category id is required" });
                return;
            }
            const category = await blogCategory_1.default.getCategoryById(id);
            if (!category) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: category });
        }
        catch (err) {
            next(err);
        }
    }
    async updateCategory(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category id is required" });
                return;
            }
            const category = await blogCategory_1.default.updateCategory(id, req.body);
            if (!category) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Category updated", data: category });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category id is required" });
                return;
            }
            const category = await blogCategory_1.default.deleteCategory(id);
            if (!category) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Category deleted", data: category });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleCategoryStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category id is required" });
                return;
            }
            const updated = await blogCategory_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Category not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Category status toggled", data: updated });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new BlogCategoryController();
