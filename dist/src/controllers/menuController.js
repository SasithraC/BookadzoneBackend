"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuController = void 0;
const menuService_1 = __importDefault(require("../services/menuService"));
const httpResponse_1 = require("../utils/httpResponse");
class MenuController {
    async createMenu(req, res, next) {
        try {
            const menu = await menuService_1.default.createMenu(req.body);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu created", data: menu });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async getAllMenus(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await menuService_1.default.getAllMenus(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async getMenuById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu id is required" });
                return;
            }
            const menu = await menuService_1.default.getMenuById(id);
            if (!menu) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: menu });
        }
        catch (err) {
            next(err);
        }
    }
    async updateMenu(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu id is required" });
                return;
            }
            const menu = await menuService_1.default.updateMenu(id, req.body);
            if (!menu) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu updated", data: menu });
        }
        catch (err) {
            next(err);
        }
    }
    async softDeleteMenu(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu id is required" });
                return;
            }
            const menu = await menuService_1.default.softDeleteMenu(id);
            if (!menu) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu deleted successfully", data: menu });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleMenuStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu id is required" });
                return;
            }
            const updated = await menuService_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu status toggled", data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllTrashMenus(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await menuService_1.default.getAllTrashMenus(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async restoreMenu(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu id is required" });
                return;
            }
            const menu = await menuService_1.default.restoreMenu(id);
            if (!menu) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu restored successfully", data: menu });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteMenuPermanently(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu id is required" });
                return;
            }
            const menu = await menuService_1.default.deleteMenuPermanently(id);
            if (!menu) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Menu not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Menu permanently deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.menuController = new MenuController();
