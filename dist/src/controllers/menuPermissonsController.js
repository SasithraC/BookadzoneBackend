"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuPermissionController = void 0;
const menuPermissionService_1 = __importDefault(require("../services/menuPermissionService"));
const httpResponse_1 = require("../utils/httpResponse");
class MenuPermissionController {
    async createMenuPermission(req, res, next) {
        try {
            const menuPermission = await menuPermissionService_1.default.createMenuPermission(req.body);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu permission created", data: menuPermission });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async getAllMenuPermissions(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await menuPermissionService_1.default.getAllMenuPermissions(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async getMenuPermissionById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission id is required" });
                return;
            }
            const menuPermission = await menuPermissionService_1.default.getMenuPermissionById(id);
            if (!menuPermission) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: menuPermission });
        }
        catch (err) {
            next(err);
        }
    }
    async updateMenuPermission(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission id is required" });
                return;
            }
            const menuPermission = await menuPermissionService_1.default.updateMenuPermission(id, req.body);
            if (!menuPermission) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu permission updated", data: menuPermission });
        }
        catch (err) {
            next(err);
        }
    }
    async softDeleteMenuPermission(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission id is required" });
                return;
            }
            const menuPermission = await menuPermissionService_1.default.softDeleteMenuPermission(id);
            if (!menuPermission) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu permission deleted successfully", data: menuPermission });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleMenuPermissionStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission id is required" });
                return;
            }
            const updated = await menuPermissionService_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu permission status toggled", data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllTrashMenuPermissions(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await menuPermissionService_1.default.getAllTrashMenuPermissions(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async restoreMenuPermission(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission id is required" });
                return;
            }
            const menuPermission = await menuPermissionService_1.default.restoreMenuPermission(id);
            if (!menuPermission) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu permission restored successfully", data: menuPermission });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteMenuPermissionPermanently(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission id is required" });
                return;
            }
            const menuPermission = await menuPermissionService_1.default.deleteMenuPermissionPermanently(id);
            if (!menuPermission) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu permission not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu permission permanently deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.menuPermissionController = new MenuPermissionController();
