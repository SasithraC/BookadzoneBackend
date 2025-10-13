"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validationHelper_1 = __importDefault(require("../utils/validationHelper"));
const common_service_1 = require("./common.service");
const roleRepository_1 = __importDefault(require("../repositories/roleRepository"));
const roleModel_1 = require("../models/roleModel");
const rolePrivilegeModel_1 = require("../models/rolePrivilegeModel");
const menuGroupModel_1 = require("../models/menuGroupModel");
class RoleService {
    constructor() {
        this.commonService = new common_service_1.CommonService(roleModel_1.RoleModel);
    }
    validateRoleData(data, isUpdate = false) {
        const rules = [
            !isUpdate
                ? validationHelper_1.default.isRequired(data.name, "name")
                : data.name !== undefined
                    ? validationHelper_1.default.isNonEmptyString(data.name, "name")
                    : null,
            data.name !== undefined ? validationHelper_1.default.maxLength(data.name, "name", 100) : null,
            validationHelper_1.default.isValidEnum(data.status, "status", ["active", "inactive"]),
            validationHelper_1.default.isBoolean(data.isDeleted, "isDeleted"),
            !isUpdate
                ? validationHelper_1.default.isRequired(data.slug, "slug")
                : data.slug !== undefined
                    ? validationHelper_1.default.isNonEmptyString(data.slug, "slug")
                    : null,
        ];
        const errors = validationHelper_1.default.validate(rules);
        if (errors.length > 0) {
            throw new Error(errors.map(e => e.message).join(", "));
        }
    }
    async createRole(data) {
        console.log('RoleService: Creating role with input:', JSON.stringify(data, null, 2));
        let slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        this.validateRoleData({ name: data.name, slug, status: "active", isDeleted: false });
        const [nameExists, slugExists] = await Promise.all([
            this.commonService.existsByField("name", data.name),
            this.commonService.existsByField("slug", slug),
        ]);
        if (nameExists) {
            console.error('RoleService: Role name already exists:', data.name);
            throw new Error("Role with this name already exists");
        }
        if (slugExists) {
            slug = `${slug}-${Date.now()}`;
            console.log('RoleService: Appended timestamp to slug:', slug);
        }
        const roleData = {
            name: data.name,
            slug,
            status: "active",
            isDeleted: false,
        };
        const role = await roleRepository_1.default.createRole(roleData);
        console.log('RoleService: Role created:', JSON.stringify(role, null, 2));
        const allGroups = await menuGroupModel_1.GroupModel.find({ status: 'active', isDeleted: false }).select('_id').lean();
        console.log('RoleService: All active menu groups:', JSON.stringify(allGroups, null, 2));
        const selectedMenuGroupIds = new Set(data.rolePrivileges?.map(p => p.menuGroupId) || []);
        console.log('RoleService: Selected menuGroupIds:', Array.from(selectedMenuGroupIds));
        if (selectedMenuGroupIds.has(undefined) || selectedMenuGroupIds.has('undefined')) {
            console.error('RoleService: Undefined menuGroupId found in rolePrivileges:', data.rolePrivileges);
        }
        const privileges = allGroups.map((group, index) => {
            const groupId = group._id?.toString();
            if (!groupId) {
                console.error(`RoleService: Missing _id for group at index ${index}:`, JSON.stringify(group, null, 2));
            }
            const privilege = {
                roleId: role._id,
                menuGroupId: groupId ? new mongoose_1.Types.ObjectId(groupId) : undefined,
                status: groupId ? selectedMenuGroupIds.has(groupId) : false,
            };
            console.log(`RoleService: Creating privilege ${index + 1}:`, JSON.stringify(privilege, null, 2));
            return privilege;
        });
        if (privileges.length > 0) {
            await roleRepository_1.default.createRolePrivileges(privileges);
            console.log('RoleService: Privileges created:', privileges.length);
        }
        else {
            console.error('RoleService: No privileges created; empty privileges array');
        }
        return role;
    }
    async getAllRoles(page = 1, limit = 10, filter) {
        console.log('RoleService: Fetching roles:', { page, limit, filter });
        return await roleRepository_1.default.getAllRoles(page, limit, filter);
    }
    async getRoleById(id) {
        console.log('RoleService: Fetching role by ID:', id);
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            console.error('RoleService: Invalid role ID:', error.message);
            throw new Error(error.message);
        }
        const role = await roleRepository_1.default.getRoleById(id);
        if (!role) {
            console.log('RoleService: Role not found for ID:', id);
            return null;
        }
        let privileges = [];
        try {
            privileges = await roleRepository_1.default.getRolePrivileges(id);
            console.log('RoleService: Privileges fetched for role:', JSON.stringify(privileges, null, 2));
        }
        catch (err) {
            console.error('RoleService: Error fetching privileges:', err.message, err.stack);
        }
        const roleObj = typeof role.toObject === "function" ? role.toObject() : role;
        const roleWithPrivileges = {
            ...roleObj,
            rolePrivileges: privileges.map((p) => ({
                menuGroupId: p.menuGroupId.toString(),
                status: p.status,
            })),
        };
        console.log('RoleService: Role with privileges:', JSON.stringify(roleWithPrivileges, null, 2));
        return roleWithPrivileges;
    }
    async softDeleteRole(id) {
        console.log('RoleService: Soft deleting role:', id);
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            console.error('RoleService: Invalid role ID:', error.message);
            throw new Error(error.message);
        }
        return await roleRepository_1.default.softDeleteRole(id);
    }
    async toggleStatus(id) {
        console.log('RoleService: Toggling status for role:', id);
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            console.error('RoleService: Invalid role ID:', error.message);
            throw new Error(error.message);
        }
        return await roleRepository_1.default.toggleStatus(id);
    }
    async updateRole(id, data) {
        console.log('RoleService: Updating role:', { id, data: JSON.stringify(data, null, 2) });
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            console.error('RoleService: Invalid role ID:', error.message);
            throw new Error(error.message);
        }
        this.validateRoleData(data, true);
        if (data.name || data.slug) {
            const [nameExists, slugExists] = await Promise.all([
                data.name ? this.commonService.existsByField(data.name, id) : Promise.resolve(false),
                data.slug ? this.commonService.existsByField(data.slug, id) : Promise.resolve(false),
            ]);
            if (nameExists) {
                console.error('RoleService: Role name already exists:', data.name);
                throw new Error("Role with this name already exists");
            }
            if (slugExists) {
                console.error('RoleService: Role slug already exists:', data.slug);
                throw new Error("Role with this slug already exists");
            }
        }
        let slug = data.slug;
        if (data.name && !slug) {
            slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const slugExists = await this.commonService.existsByField(slug, id);
            if (slugExists) {
                slug = `${slug}-${Date.now()}`;
                console.log('RoleService: Appended timestamp to slug:', slug);
            }
            data.slug = slug;
        }
        const role = await roleRepository_1.default.updateRole(id, data);
        if (!role) {
            console.error('RoleService: Role not found for update:', id);
            return null;
        }
        console.log('RoleService: Role updated:', JSON.stringify(role, null, 2));
        if (data.rolePrivileges) {
            console.log('RoleService: Updating role privileges:', JSON.stringify(data.rolePrivileges, null, 2));
            await rolePrivilegeModel_1.RolePrivilgeModel.deleteMany({ roleId: id });
            console.log('RoleService: Existing privileges deleted for role:', id);
            const allGroups = await menuGroupModel_1.GroupModel.find({ status: 'active', isDeleted: false }).select('_id').lean();
            const validMenuGroupIds = new Set(allGroups.map((group) => group._id.toString()));
            const privileges = allGroups.map((group) => {
                const groupId = group._id.toString();
                const privilege = {
                    roleId: new mongoose_1.Types.ObjectId(id),
                    menuGroupId: new mongoose_1.Types.ObjectId(groupId),
                    status: data.rolePrivileges?.some((p) => p.menuGroupId === groupId && p.status) || false,
                };
                console.log('RoleService: Creating privilege for update:', JSON.stringify(privilege, null, 2));
                return privilege;
            });
            const validPrivileges = privileges.filter((p) => p.menuGroupId && mongoose_1.Types.ObjectId.isValid(p.menuGroupId));
            if (validPrivileges.length > 0) {
                await roleRepository_1.default.createRolePrivileges(validPrivileges);
                console.log('RoleService: New privileges created:', validPrivileges.length);
            }
            else {
                console.warn('RoleService: No valid privileges to create');
            }
        }
        return role;
    }
    async getAllTrashRoles(page = 1, limit = 10, filter) {
        console.log('RoleService: Fetching trash roles:', { page, limit, filter });
        return await roleRepository_1.default.getAllTrashRoles(page, limit, filter);
    }
    async restoreRole(id) {
        console.log('RoleService: Restoring role:', id);
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            console.error('RoleService: Invalid role ID:', error.message);
            throw new Error(error.message);
        }
        return await roleRepository_1.default.restoreRole(id);
    }
    async deleteRolePermanently(id) {
        console.log('RoleService: Permanently deleting role:', id);
        const error = validationHelper_1.default.isValidObjectId(id, "id");
        if (error) {
            console.error('RoleService: Invalid role ID:', error.message);
            throw new Error(error.message);
        }
        return await roleRepository_1.default.deleteRolePermanently(id);
    }
    async createPrivilegeTable() {
        try {
            console.log('RoleService: Starting createPrivilegeTable');
            const menuPermissions = await roleRepository_1.default.getActiveMenuPermissions();
            console.log('RoleService: Menu permissions fetched:', JSON.stringify(menuPermissions, null, 2));
            const mainMenus = await roleRepository_1.default.getActiveMainMenus();
            console.log('RoleService: Main menus fetched:', JSON.stringify(mainMenus, null, 2));
            const submenuGroups = await roleRepository_1.default.getSubmenuGroups();
            console.log('RoleService: Submenu groups fetched:', JSON.stringify(submenuGroups, null, 2));
            const menupermissons = menuPermissions.map(p => ({
                name: p.name,
                id: p._id.toString(),
            }));
            console.log('RoleService: Menupermissons constructed:', JSON.stringify(menupermissons, null, 2));
            const menu = [];
            for (const mainMenu of mainMenus) {
                console.log('RoleService: Processing main menu:', {
                    name: mainMenu.name,
                    slug: mainMenu.slug,
                    _id: mainMenu._id.toString(),
                });
                const mainEntry = {
                    menu: mainMenu.name,
                    slug: mainMenu.slug,
                    submenus: [],
                };
                const submenus = await roleRepository_1.default.getSubmenusByMainMenuId(mainMenu._id);
                console.log(`RoleService: Submenus for main menu ${mainMenu.name} (${mainMenu._id.toString()}):`, JSON.stringify(submenus, null, 2));
                for (const submenu of submenus) {
                    const subEntry = {
                        submenu: submenu.name,
                        id: submenu._id.toString(),
                        slug: submenu.slug,
                        permisson: [],
                    };
                    const groups = submenuGroups
                        .filter((g) => {
                        const match = g.submenuId && g.menuPermissionId && g.submenuId._id.toString() === submenu._id.toString();
                        console.log('RoleService: Filtering group for submenu:', {
                            submenuId: submenu._id.toString(),
                            groupSubmenuId: g.submenuId?._id?.toString(),
                            menuPermissionId: g.menuPermissionId?._id?.toString(),
                            menuPermissionSlug: g.menuPermissionId?.slug,
                            groupId: g._id?.toString(),
                            match,
                        });
                        return match;
                    })
                        .map((g) => {
                        const perm = {
                            menupermissonSlug: g.menuPermissionId?.slug ?? "",
                            menupermissonId: g.menuPermissionId?._id?.toString() ?? "",
                            menuGroupId: g._id.toString(),
                        };
                        console.log('RoleService: Mapping permission for submenu:', {
                            submenuName: submenu.name,
                            submenuId: submenu._id.toString(),
                            groupId: g._id?.toString(),
                            ...perm,
                        });
                        return perm;
                    });
                    console.log(`RoleService: Permissions for submenu ${submenu.name} (${submenu._id.toString()}):`, JSON.stringify(groups, null, 2));
                    subEntry.permisson = groups;
                    mainEntry.submenus.push(subEntry);
                }
                console.log('RoleService: Main menu entry:', JSON.stringify(mainEntry, null, 2));
                menu.push(mainEntry);
            }
            console.log('RoleService: Final menu constructed:', JSON.stringify(menu, null, 2));
            return { menupermissons, menu };
        }
        catch (err) {
            console.error('RoleService: Error in createPrivilegeTable:', err.message, err.stack);
            throw err;
        }
    }
}
exports.default = new RoleService();
