"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const footerInfoRepository_1 = __importDefault(require("../repositories/footerInfoRepository"));
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const footerinfoModel_1 = require("../models/footerinfoModel");
const common_service_1 = require("./common.service");
class FooterInfoService {
    constructor() {
        this.commonService = new common_service_1.CommonService(footerinfoModel_1.FooterInfoModel);
    }
    validateFooterInfoData(data, file, isUpdate = false) {
        console.log(`validateFooterInfoData: file:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : null);
        console.log(`validateFooterInfoData: isUpdate: ${isUpdate}, data:`, data);
        const rules = [
            !isUpdate
                ? validationHelper_1.default.isRequired(file, "logo") // Check if file object exists for creation
                : (file ? validationHelper_1.default.isNonEmptyString(file.filename, "logo") : null),
            (file ? validationHelper_1.default.maxLength(file.filename, "logo", 500) : null),
            !isUpdate
                ? validationHelper_1.default.isRequired(data.description, "description")
                : (data.description !== undefined ? validationHelper_1.default.isNonEmptyString(data.description, "description") : null),
            (data.description !== undefined ? validationHelper_1.default.maxLength(data.description, "description", 2000) : null),
            // Optional fields
            (data.socialmedia !== undefined ? validationHelper_1.default.maxLength(data.socialmedia, "socialmedia", 200) : null),
            (data.socialmedialinks !== undefined ? validationHelper_1.default.maxLength(data.socialmedialinks, "socialmedialinks", 200) : null),
            (data.google !== undefined ? validationHelper_1.default.maxLength(data.google, "google", 200) : null),
            (data.appstore !== undefined ? validationHelper_1.default.maxLength(data.appstore, "appstore", 200) : null),
            data.status !== undefined ? validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"]) : null,
            (typeof data.priority === 'number' ? validationHelper_1.default.isNumber(data.priority, "priority") : null),
            data.isDeleted !== undefined ? validationHelper_1.default.isBoolean(data.isDeleted, "isDeleted") : null,
        ].filter(Boolean);
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            console.log(`Validation errors in validateFooterInfoData:`, errors);
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createFooterInfo(data, file) {
        console.log(`createFooterInfo: data:`, data, `file:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : null);
        if (!file) {
            console.log(`createFooterInfo: No logo file provided`);
            throw new Error("Logo file is required for creation");
        }
        const createData = { ...data, logo: file.filename };
        this.validateFooterInfoData(createData, file);
        const footerInfoData = {
            logo: file.filename,
            description: createData.description,
            socialmedia: createData.socialmedia ?? "",
            socialmedialinks: createData.socialmedialinks ?? "",
            google: createData.google ?? "",
            appstore: createData.appstore ?? "",
            status: createData.status || 'active',
            priority: createData.priority ? parseInt(createData.priority) : 1,
            isDeleted: false,
        };
        console.log(`createFooterInfo: Creating footer info with data:`, footerInfoData);
        const exists = await this.commonService.existsByField("logo", footerInfoData.logo);
        if (exists) {
            console.log(`createFooterInfo: Logo already exists: ${footerInfoData.logo}`);
            throw new Error("Footer Info with this logo already exists");
        }
        const result = await footerInfoRepository_1.default.createFooterInfo(footerInfoData);
        console.log(`createFooterInfo: Footer info created successfully:`, result);
        return result;
    }
    async getFooterInfo(page = 1, limit = 10, filter) {
        return await footerInfoRepository_1.default.getFooterInfo(page, limit, filter);
    }
    async getFooterInfoById(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error)
            throw new Error(error.message);
        return await footerInfoRepository_1.default.getFooterInfoById(id);
    }
    async updateFooterInfo(id, data, file) {
        console.log(`updateFooterInfo: id: ${id}, data:`, data, `file:`, file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : null);
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error)
            throw new Error(error.message);
        this.validateFooterInfoData(data, file, true);
        const updateData = { ...data };
        if (file?.filename) {
            updateData.logo = file.filename;
        }
        const result = await footerInfoRepository_1.default.updateFooterInfo(id, updateData);
        console.log(`updateFooterInfo: Footer info updated successfully:`, result);
        return result;
    }
    async softDeleteFooterInfo(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error)
            throw new Error(error.message);
        return await footerInfoRepository_1.default.softDeleteFooterInfo(id);
    }
    async toggleStatus(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error)
            throw new Error(error.message);
        return await footerInfoRepository_1.default.toggleStatus(id);
    }
    async getAllTrashFooterInfos(page = 1, limit = 10, filter) {
        return await footerInfoRepository_1.default.getAllTrashFooterInfos(page, limit, filter);
    }
    async restoreFooterInfo(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error)
            throw new Error(error.message);
        return await footerInfoRepository_1.default.restoreFooterInfo(id);
    }
    async deleteFooterInfoPermanently(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error)
            throw new Error(error.message);
        return await footerInfoRepository_1.default.deleteFooterInfoPermanently(id);
    }
}
exports.default = new FooterInfoService();
