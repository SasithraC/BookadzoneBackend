"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faqService_1 = __importDefault(require("../services/faqService"));
const httpResponse_1 = require("../utils/httpResponse");
class FaqController {
    async createFaq(req, res, next) {
        try {
            const faq = await faqService_1.default.createFaq(req.body);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "FAQ created", data: faq });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async getAllFaqs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await faqService_1.default.getAllFaqs(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async getFaqById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
                return;
            }
            const faq = await faqService_1.default.getFaqById(id);
            if (!faq) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: faq });
        }
        catch (err) {
            next(err);
        }
    }
    async updateFaq(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
                return;
            }
            const faq = await faqService_1.default.updateFaq(id, req.body);
            if (!faq) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "FAQ updated", data: faq });
        }
        catch (err) {
            next(err);
        }
    }
    async softDeleteFaq(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
                return;
            }
            const faq = await faqService_1.default.softDeleteFaq(id);
            if (!faq) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ not found" });
                return;
            }
            // Include updated FAQ document in response data
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "FAQ deleted successfully", data: faq });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleFaqStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
                return;
            }
            const updated = await faqService_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "FAQ status toggled", data: updated });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllTrashFaqs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await faqService_1.default.getAllTrashFaqs(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async restoreFaq(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
                return;
            }
            const faq = await faqService_1.default.restoreFaq(id);
            if (!faq) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ not found" });
                return;
            }
            // Include updated FAQ document in response data
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "FAQ restored successfully", data: faq });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteFaqPermanently(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
                return;
            }
            const faq = await faqService_1.default.deleteFaqPermanently(id);
            if (!faq) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "FAQ not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "FAQ permanently deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = new FaqController();
