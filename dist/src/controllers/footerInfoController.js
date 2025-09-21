"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const footerInfo_1 = __importDefault(require("../services/footerInfo"));
const httpResponse_1 = require("../utils/httpResponse");
class FooterInfoController {
    async createFooterInfo(req, res, next) {
        try {
            console.log(`createFooterInfo: req.file:`, req.file ? { filename: req.file.filename, size: req.file.size, mimetype: req.file.mimetype } : null);
            console.log(`createFooterInfo: req.body:`, req.body);
            if (!req.file && !req.body.logo) {
                console.log(`createFooterInfo: No logo file or logo field provided`);
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Logo file is required" });
                return;
            }
            const footerinfo = await footerInfo_1.default.createFooterInfo(req.body, req.file);
            console.log(`createFooterInfo: Success, footer created:`, footerinfo);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Footer Info created", data: footerinfo });
        }
        catch (err) {
            console.error(`createFooterInfo: Error:`, err.message);
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
        }
    }
    async getFooterInfo(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const footerinfo = await footerInfo_1.default.getFooterInfo(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: footerinfo });
        }
        catch (err) {
            next(err);
        }
    }
    async getFooterInfoById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info id is required" });
                return;
            }
            const footerinfo = await footerInfo_1.default.getFooterInfoById(id);
            if (!footerinfo) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: footerinfo });
        }
        catch (err) {
            next(err);
        }
    }
    async updateFooterInfo(req, res, next) {
        try {
            console.log(`updateFooterInfo: req.file:`, req.file ? { filename: req.file.filename, size: req.file.size, mimetype: req.file.mimetype } : null);
            console.log(`updateFooterInfo: req.body:`, req.body);
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info id is required" });
                return;
            }
            const footerinfo = await footerInfo_1.default.updateFooterInfo(id, req.body, req.file);
            if (!footerinfo) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info not found" });
                return;
            }
            console.log(`updateFooterInfo: Success, footer updated:`, footerinfo);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Footer Info updated", data: footerinfo });
        }
        catch (err) {
            console.error(`updateFooterInfo: Error:`, err.message);
            next(err);
        }
    }
    async softDeleteFooterInfo(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info id is required" });
                return;
            }
            const footerinfo = await footerInfo_1.default.softDeleteFooterInfo(id);
            if (!footerinfo) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Footer Info deleted successfully", data: footerinfo });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleFooterInfoStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info id is required" });
                return;
            }
            const updated = await footerInfo_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Footer Info status toggled", data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllTrashFooterInfos(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await footerInfo_1.default.getAllTrashFooterInfos(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async restoreFooterInfo(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info id is required" });
                return;
            }
            const footerinfo = await footerInfo_1.default.restoreFooterInfo(id);
            if (!footerinfo) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Footer Info restored successfully", data: footerinfo });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteFooterInfoPermanently(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info id is required" });
                return;
            }
            const footerinfo = await footerInfo_1.default.deleteFooterInfoPermanently(id);
            if (!footerinfo) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Footer Info not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Footer Info permanently deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = new FooterInfoController();
