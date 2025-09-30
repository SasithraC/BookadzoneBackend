"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configRepository_1 = __importDefault(require("../repositories/configRepository"));
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const configModel_1 = require("../models/configModel");
const common_service_1 = require("./common.service");
class ConfigService {
    constructor() {
        this.commonService = new common_service_1.CommonService(configModel_1.ConfigModel);
    }
    validateConfigData(data, isUpdate = false) {
        const rules = [
            !isUpdate
                ? validationHelper_1.default.isRequired(data.name, "name")
                : (data.name !== undefined ? validationHelper_1.default.isNonEmptyString(data.name, "name") : null),
            (data.name !== undefined ? validationHelper_1.default.maxLength(data.name, "name", 100) : null),
            !isUpdate
                ? validationHelper_1.default.isRequired(data.slug, "slug")
                : (data.slug !== undefined ? validationHelper_1.default.isNonEmptyString(data.slug, "slug") : null),
            (data.slug !== undefined ? validationHelper_1.default.maxLength(data.slug, "slug", 100) : null),
            (data.configFields !== undefined ? validationHelper_1.default.isArray(data.configFields, "configFields") : null),
            data.configFields && data.configFields.length > 0 ?
                data.configFields.map((field, index) => [
                    validationHelper_1.default.isRequired(field.key, `configFields[${index}].key`),
                    validationHelper_1.default.isRequired(field.value, `configFields[${index}].value`),
                    validationHelper_1.default.maxLength(field.key, `configFields[${index}].key`, 50),
                    validationHelper_1.default.maxLength(field.value, `configFields[${index}].value`, 500),
                ]).flat() : null,
            validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"]),
            validationHelper_1.default.isBoolean(data.isDeleted, "isDeleted"),
        ];
        const errors = validationHelper_1.default.validate(rules.flat().filter(Boolean));
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createConfig(data) {
        this.validateConfigData(data);
        const exists = await this.commonService.existsByField("slug", data.slug);
        if (exists) {
            throw new Error("Config with this slug already exists");
        }
        return await configRepository_1.default.createConfig(data);
    }
    async getAllConfigs(page = 1, limit = 10, filter) {
        return await configRepository_1.default.getAllConfigs(page, limit, filter);
    }
    async getConfigById(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await configRepository_1.default.getConfigById(id);
    }
    async updateConfig(id, data) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        this.validateConfigData(data, true);
        // Check if slug changed and exists
        if (data.slug) {
            const currentConfig = await configRepository_1.default.getConfigById(id);
            if (currentConfig && currentConfig.slug !== data.slug) {
                const exists = await this.commonService.existsByField("slug", data.slug);
                if (exists) {
                    throw new Error("Config with this slug already exists");
                }
            }
        }
        return await configRepository_1.default.updateConfig(id, data);
    }
    async softDeleteConfig(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await configRepository_1.default.softDeleteConfig(id);
    }
    async toggleStatus(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await configRepository_1.default.toggleStatus(id);
    }
    async getAllTrashConfigs(page = 1, limit = 10, filter) {
        return await configRepository_1.default.getAllTrashConfigs(page, limit, filter);
    }
    async restoreConfig(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await configRepository_1.default.restoreConfig(id);
    }
    async deleteConfigPermanently(id) {
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            throw new Error(error.message);
        }
        return await configRepository_1.default.deleteConfigPermanently(id);
    }
}
exports.default = new ConfigService();
