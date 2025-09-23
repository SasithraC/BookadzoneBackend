"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configService_1 = __importDefault(require("../services/configService"));
const httpResponse_1 = require("../utils/httpResponse");
class ConfigController {
    async createConfig(req, res, next) {
        try {
            const config = await configService_1.default.createConfig(req.body);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Config created", data: config });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async getAllConfigs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await configService_1.default.getAllConfigs(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async getConfigById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config id is required" });
                return;
            }
            const config = await configService_1.default.getConfigById(id);
            if (!config) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: config });
        }
        catch (err) {
            next(err);
        }
    }
    async updateConfig(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config id is required" });
                return;
            }
            const config = await configService_1.default.updateConfig(id, req.body);
            if (!config) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Config updated", data: config });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async softDeleteConfig(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config id is required" });
                return;
            }
            const updated = await configService_1.default.softDeleteConfig(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Config soft deleted", data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config id is required" });
                return;
            }
            const updated = await configService_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Config status toggled", data: updated });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllTrashConfigs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await configService_1.default.getAllTrashConfigs(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async restoreConfig(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config id is required" });
                return;
            }
            const config = await configService_1.default.restoreConfig(id);
            if (!config) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Config restored successfully", data: config });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteConfigPermanently(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config id is required" });
                return;
            }
            const config = await configService_1.default.deleteConfigPermanently(id);
            if (!config) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Config not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Config permanently deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = new ConfigController();
