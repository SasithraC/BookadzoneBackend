"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleController = void 0;
const roleService_1 = __importDefault(require("../services/roleService"));
const httpResponse_1 = require("../utils/httpResponse");
// Role Controller
class RoleController {
    async createRole(req, res, next) {
        try {
            const role = await roleService_1.default.createRole(req.body);
            res.status(201).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Role created", data: role });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async getAllRoles(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await roleService_1.default.getAllRoles(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async getRoleById(req, res, next) {
        try {
            const id = req.params.id;
            console.log('RoleController: Received getRoleById request with ID:', id);
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role id is required" });
                return;
            }
            // Fetch role from service
            const roleData = await roleService_1.default.getRoleById(id);
            if (!roleData) {
                console.log('RoleController: Role not found for ID:', id);
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role not found" });
                return;
            }
            // Log and return full data
            console.log('RoleController: Final role data being returned:', JSON.stringify(roleData, null, 2));
            res.status(200).json({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Role fetched successfully",
                data: roleData, // includes rolePrivileges
            });
        }
        catch (err) {
            console.error('RoleController: Error in getRoleById:', err.message, err.stack);
            res.status(500).json({
                status: httpResponse_1.HTTP_RESPONSE.FAIL,
                message: err.message || "Internal server error",
            });
        }
    }
    // In RoleController (add to class RoleController)
    async updateRole(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role id is required" });
                return;
            }
            const roleData = req.body;
            const updatedRole = await roleService_1.default.updateRole(id, roleData);
            if (!updatedRole) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Role updated successfully", data: updatedRole });
        }
        catch (err) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
                return;
            }
            next(err);
        }
    }
    async softDeleteRole(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role id is required" });
                return;
            }
            const role = await roleService_1.default.softDeleteRole(id);
            if (!role) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Role deleted successfully", data: role });
        }
        catch (err) {
            next(err);
        }
    }
    async toggleRoleStatus(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role id is required" });
                return;
            }
            const updated = await roleService_1.default.toggleStatus(id);
            if (!updated) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Role status toggled", data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllTrashRoles(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = req.query.status;
            const result = await roleService_1.default.getAllTrashRoles(page, limit, filter);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    async restoreRole(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role id is required" });
                return;
            }
            const role = await roleService_1.default.restoreRole(id);
            if (!role) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Role restored successfully", data: role });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteRolePermanently(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role id is required" });
                return;
            }
            const role = await roleService_1.default.deleteRolePermanently(id);
            if (!role) {
                res.status(404).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: "Role not found" });
                return;
            }
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, message: "Role permanently deleted" });
        }
        catch (err) {
            next(err);
        }
    }
    async createPrivilegeTable(req, res, next) {
        try {
            console.log('Controller: createPrivilegeTable called');
            const privilegeData = await roleService_1.default.createPrivilegeTable();
            console.log('Controller: Data returned', privilegeData);
            res.status(200).json({ status: httpResponse_1.HTTP_RESPONSE.SUCCESS, data: privilegeData });
        }
        catch (err) {
            console.error('Controller error:', err.message);
            res.status(500).json({ status: httpResponse_1.HTTP_RESPONSE.FAIL, message: err.message });
        }
    }
}
exports.roleController = new RoleController();
