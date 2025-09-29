"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faqRepository_1 = __importDefault(require("../repositories/faqRepository"));
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const faqModel_1 = require("../models/faqModel");
const common_service_1 = require("./common.service");
class FaqService {
    constructor() {
        this.commonService = new common_service_1.CommonService(faqModel_1.FaqModel);
    }
    validateFaqData(data, isUpdate = false) {
        const rules = [
            !isUpdate
                ? validationHelper_1.default.isRequired(data.question, "question")
                : (data.question !== undefined ? validationHelper_1.default.isNonEmptyString(data.question, "question") : null),
            (data.question !== undefined ? validationHelper_1.default.maxLength(data.question, "question", 500) : null),
            !isUpdate
                ? validationHelper_1.default.isRequired(data.answer, "answer")
                : (data.answer !== undefined ? validationHelper_1.default.isNonEmptyString(data.answer, "answer") : null),
            (data.answer !== undefined ? validationHelper_1.default.maxLength(data.answer, "answer", 2000) : null),
            validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"]),
            validationHelper_1.default.isBoolean(data.isDeleted, "isDeleted"),
        ];
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createFaq(data) {
        this.validateFaqData(data);
        const exists = await this.commonService.existsByField("question", data.question);
        if (exists) {
            throw new Error("FAQ with this question already exists");
        }
        return await faqRepository_1.default.createFaq(data);
    }
    async getAllFaqs(page = 1, limit = 10, filter) {
        return await faqRepository_1.default.getAllFaqs(page, limit, filter);
    }
    async getFaqById(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await faqRepository_1.default.getFaqById(id);
    }
    async updateFaq(id, data) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        this.validateFaqData(data, true);
        return await faqRepository_1.default.updateFaq(id, data);
    }
    async softDeleteFaq(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await faqRepository_1.default.softDeleteFaq(id);
    }
    async toggleStatus(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await faqRepository_1.default.toggleStatus(id);
    }
    async getAllTrashFaqs(page = 1, limit = 10, filter) {
        return await faqRepository_1.default.getAllTrashFaqs(page, limit, filter);
    }
    async restoreFaq(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await faqRepository_1.default.restoreFaq(id);
    }
    async deleteFaqPermanently(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await faqRepository_1.default.deleteFaqPermanently(id);
    }
}
exports.default = new FaqService();
