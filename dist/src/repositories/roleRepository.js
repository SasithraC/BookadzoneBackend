"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_repository_1 = require("./common.repository");
const roleModel_1 = require("../models/roleModel");
const menuModel_1 = require("../models/menuModel");
const subMenuModel_1 = require("../models/subMenuModel");
const menuPermissonModel_1 = require("../models/menuPermissonModel");
const menuGroupModel_1 = require("../models/menuGroupModel");
const rolePrivilegeModel_1 = require("../models/rolePrivilegeModel");
class RoleRepository {
    constructor() {
        this.commonRepository = new common_repository_1.CommonRepository(roleModel_1.RoleModel);
    }
    async createRole(data) {
        console.log('RoleRepository: Creating role:', JSON.stringify(data, null, 2));
        return await roleModel_1.RoleModel.create(data);
    }
    async createRolePrivileges(privileges) {
        console.log('RoleRepository: Creating role privileges:', JSON.stringify(privileges, null, 2));
        for (const priv of privileges) {
            console.log('RoleRepository: Validating privilege:', {
                roleId: priv.roleId?.toString(),
                menuGroupId: priv.menuGroupId?.toString(),
                status: priv.status,
            });
            if (!priv.roleId || !mongoose_1.Types.ObjectId.isValid(priv.roleId)) {
                console.error('RoleRepository: Invalid roleId:', priv.roleId);
                throw new Error(`Invalid or missing roleId: ${priv.roleId}`);
            }
            if (!priv.menuGroupId || !mongoose_1.Types.ObjectId.isValid(priv.menuGroupId)) {
                console.error('RoleRepository: Invalid menuGroupId:', priv.menuGroupId);
                throw new Error(`Invalid or missing menuGroupId: ${priv.menuGroupId}`);
            }
        }
        const result = await rolePrivilegeModel_1.RolePrivilgeModel.insertMany(privileges);
        console.log('RoleRepository: Role privileges created:', JSON.stringify(result, null, 2));
        return result;
    }
    async getAllRoles(page = 1, limit = 10, filter) {
        console.log('RoleRepository: Fetching roles:', { page, limit, filter });
        const query = { isDeleted: false };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
            roleModel_1.RoleModel.find(query).skip(skip).limit(limit),
            this.commonRepository.getStats(),
        ]);
        const totalPages = Math.ceil(stats.total / limit) || 1;
        console.log('RoleRepository: Roles fetched:', { dataCount: data.length, totalPages });
        return {
            data,
            meta: {
                ...stats,
                totalPages,
                page,
                limit,
            },
        };
    }
    async getRoleById(id) {
        console.log('RoleRepository: Fetching role by ID:', id);
        try {
            const objectId = typeof id === 'string' ? new mongoose_1.Types.ObjectId(id) : id;
            console.log('RoleRepository: Converted role ID to ObjectId:', objectId.toString());
            const role = await roleModel_1.RoleModel.findOne({ _id: objectId, isDeleted: false }).lean();
            console.log('RoleRepository: Role query result:', JSON.stringify(role, null, 2));
            return role;
        }
        catch (err) {
            console.error('RoleRepository: Error in getRoleById:', err.message, err.stack);
            throw err; // Re-throw to allow caller to handle
        }
    }
    async getRolePrivileges(roleId) {
        console.log('RoleRepository: Fetching privileges for role ID:', roleId);
        const objectId = typeof roleId === 'string' ? new mongoose_1.Types.ObjectId(roleId) : roleId;
        const privileges = await rolePrivilegeModel_1.RolePrivilgeModel.find({ roleId: objectId, isDeleted: false, status: true }).lean();
        console.log('RoleRepository: Privileges found:', JSON.stringify(privileges, null, 2));
        return privileges;
    }
    async softDeleteRole(id) {
        console.log('RoleRepository: Soft deleting role:', id);
        return await roleModel_1.RoleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
    async toggleStatus(id) {
        console.log('RoleRepository: Toggling status for role:', id);
        const stringId = typeof id === "string" ? id : id.toString();
        return await this.commonRepository.toggleStatus(stringId);
    }
    // In RoleRepository (already present)
    async updateRole(id, data) {
        console.log('RoleRepository: Updating role:', { id, data: JSON.stringify(data, null, 2) });
        const role = await roleModel_1.RoleModel.findByIdAndUpdate(id, data, { new: true }).lean();
        console.log('RoleRepository: Role updated:', JSON.stringify(role, null, 2));
        return role;
    }
    async getAllTrashRoles(page = 1, limit = 10, filter) {
        console.log('RoleRepository: Fetching trash roles:', { page, limit, filter });
        const query = { isDeleted: true };
        if (filter === "active")
            query.status = "active";
        if (filter === "inactive")
            query.status = "inactive";
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
            roleModel_1.RoleModel.find(query).skip(skip).limit(limit),
            roleModel_1.RoleModel.countDocuments(query),
            this.commonRepository.getStats(),
        ]);
        const totalPages = Math.max(1, Math.ceil(count / limit));
        console.log('RoleRepository: Trash roles fetched:', { dataCount: data.length, totalPages });
        return {
            data,
            meta: {
                ...stats,
                total: count,
                totalPages,
                page,
                limit,
            },
        };
    }
    async restoreRole(id) {
        console.log('RoleRepository: Restoring role:', id);
        return await roleModel_1.RoleModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
    }
    async deleteRolePermanently(id) {
        console.log('RoleRepository: Permanently deleting role:', id);
        return await roleModel_1.RoleModel.findByIdAndDelete(id);
    }
    async getActiveMenuPermissions() {
        try {
            console.log('RoleRepository: Fetching active menu permissions');
            const permissions = await menuPermissonModel_1.MenuPermissionModel.find({ status: 'active', isDeleted: false }).lean();
            console.log('RoleRepository: Active menu permissions fetched:', JSON.stringify(permissions, null, 2));
            return permissions;
        }
        catch (error) {
            console.error('RoleRepository: Error fetching menu permissions:', error);
            return [];
        }
    }
    async getActiveMainMenus() {
        try {
            console.log('RoleRepository: Fetching active main menus');
            const menus = await menuModel_1.MenuModel.find({ status: 'active', isDeleted: false }).lean();
            console.log('RoleRepository: Active main menus fetched:', JSON.stringify(menus, null, 2));
            return menus;
        }
        catch (error) {
            console.error('RoleRepository: Error fetching main menus:', error);
            return [];
        }
    }
    async getSubmenusByMainMenuId(mainMenuId) {
        try {
            console.log(`RoleRepository: Fetching submenus for mainMenuId: ${mainMenuId.toString()}`);
            const submenus = await subMenuModel_1.SubmenuModel.find({
                mainMenuId,
                status: 'active',
                isDeleted: false,
            }).lean();
            console.log(`RoleRepository: Submenus for mainMenuId ${mainMenuId.toString()}:`, JSON.stringify(submenus, null, 2));
            return submenus;
        }
        catch (error) {
            console.error(`RoleRepository: Error fetching submenus for mainMenuId ${mainMenuId.toString()}:`, error);
            return [];
        }
    }
    async getSubmenuGroups() {
        try {
            console.log('RoleRepository: Fetching submenu groups');
            const rawGroups = await menuGroupModel_1.GroupModel.find({ status: 'active', isDeleted: false })
                .populate({
                path: 'submenuId',
                select: 'name slug _id',
                match: { status: 'active', isDeleted: false },
            })
                .populate({
                path: 'menuPermissionId',
                select: 'name slug _id',
                match: { status: 'active', isDeleted: false },
            })
                .lean();
            console.log('RoleRepository: Raw groups fetched:', JSON.stringify(rawGroups, null, 2));
            const filteredGroups = rawGroups
                .filter((g) => {
                const hasSubmenuId = !!g.submenuId && '_id' in g.submenuId;
                const hasMenuPermissionId = !!g.menuPermissionId && '_id' in g.menuPermissionId;
                return hasSubmenuId && hasMenuPermissionId;
            })
                .map((g) => ({
                _id: String(g._id),
                submenuId: g.submenuId,
                menuPermissionId: g.menuPermissionId,
                status: g.status,
                isDeleted: g.isDeleted,
                createdAt: g.createdAt || new Date(),
                updatedAt: g.updatedAt || new Date(),
            }));
            console.log('RoleRepository: Filtered and mapped submenu groups:', JSON.stringify(filteredGroups, null, 2));
            return filteredGroups;
        }
        catch (error) {
            console.error('RoleRepository: Error fetching submenu groups:', error);
            return [];
        }
    }
}
exports.default = new RoleRepository();
