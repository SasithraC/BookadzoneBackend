"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupController = void 0;
const groupService_1 = __importDefault(require("../services/groupService"));
const httpResponse_1 = require("../utils/httpResponse");
class GroupController {
    async createGroup(req, res, next) {
        try {
            const group = await groupService_1.default.createGroup(req.body);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Group created", data: group });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async getAllGroups(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await groupService_1.default.getAllGroups(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async getGroupById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group id is required" });
                return;
            }
            const group = await groupService_1.default.getGroupById(id);
            if (!group) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async updateGroup(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group id is required" });
                return;
            }
            const group = await groupService_1.default.updateGroup(id, req.body);
            if (!group) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Group updated", data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async softDeleteGroup(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group id is required" });
                return;
            }
            const group = await groupService_1.default.softDeleteGroup(id);
            if (!group) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Group deleted successfully", data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleGroupStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group id is required" });
                return;
            }
            const updated = await groupService_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Group status toggled", data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllTrashGroups(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await groupService_1.default.getAllTrashGroups(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async restoreGroup(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group id is required" });
                return;
            }
            const group = await groupService_1.default.restoreGroup(id);
            if (!group) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Group restored successfully", data: group });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteGroupPermanently(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group id is required" });
                return;
            }
            const group = await groupService_1.default.deleteGroupPermanently(id);
            if (!group) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Group not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Group permanently deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.groupController = new GroupController();
