"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const menuGroupModel_1 = require("../models/menuGroupModel");
const rolePrivilegeModel_1 = require("../models/rolePrivilegeModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const mongoose_1 = require("mongoose");
class AuthenticationRepository {
    async authLogin(data) {
        console.log("🔍 authLogin: Starting with input:", data);
        const { email, password } = data;
        // Find user
        console.log("🔍 authLogin: Querying User with email:", email);
        const user = await userModel_1.default
            .findOne({ email })
            .select("_id email password role status rolePrivilegeIds")
            .lean();
        if (!user) {
            console.error("❌ authLogin: Email does not exist:", email);
            throw new Error("Email does not exist");
        }
        console.log("🔍 authLogin: User found:", {
            _id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            rolePrivilegeIds: user.rolePrivilegeIds,
        });
        // Verify password
        console.log("🔍 authLogin: Verifying password for user:", email);
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ authLogin: Invalid password for user:", email);
            throw new Error("Invalid password for user");
        }
        console.log("🔍 authLogin: Password verified successfully");
        // Generate token
        console.log("🔍 authLogin: Generating token for user:", email);
        const { token, data: userData, expiresIn } = this._generateToken(user);
        console.log("🔍 authLogin: Token generated:", { token, expiresIn });
        // Fetch menus and submenus
        console.log("🔍 authLogin: Fetching menus for user:", email);
        const menus = await this._fetchUserMenus(user.rolePrivilegeIds);
        console.log("🔍 authLogin: Menus fetched:", menus);
        const result = { token, data: userData, expiresIn, menus };
        console.log("🔍 authLogin: Returning result:", result);
        return result;
    }
    async refreshToken(token) {
        console.log("🔍 refreshToken: Starting with token:", token);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("❌ refreshToken: JWT_SECRET not defined in environment");
            throw new Error("JWT_SECRET not defined in environment");
        }
        let decoded;
        try {
            console.log("🔍 refreshToken: Verifying token");
            decoded = (0, jsonwebtoken_1.verify)(token, jwtSecret);
            console.log("🔍 refreshToken: Token decoded:", decoded);
        }
        catch (err) {
            console.error("❌ refreshToken: Invalid or expired token:", err.message);
            throw new Error("Invalid or expired token");
        }
        const userId = decoded._id || decoded.id;
        console.log("🔍 refreshToken: Querying User with _id:", userId);
        const user = await userModel_1.default.findOne({ _id: userId })
            .select("_id email role status rolePrivilegeIds")
            .lean();
        if (!user) {
            console.error("❌ refreshToken: User not found for _id:", userId);
            throw new Error("User not found");
        }
        console.log("🔍 refreshToken: User found:", {
            _id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            rolePrivilegeIds: user.rolePrivilegeIds,
        });
        console.log("🔍 refreshToken: Generating new token for user:", user.email);
        const { token: newToken, data: userData, expiresIn } = this._generateToken(user);
        console.log("🔍 refreshToken: Fetching menus for user:", user.email);
        const menus = await this._fetchUserMenus(user.rolePrivilegeIds);
        console.log("🔍 refreshToken: Menus fetched:", menus);
        const result = { token: newToken, data: userData, expiresIn, menus };
        console.log("🔍 refreshToken: Returning result:", result);
        return result;
    }
    async _fetchUserMenus(rolePrivilegeIds) {
        console.log("🔍 _fetchUserMenus: Starting with rolePrivilegeIds:", rolePrivilegeIds);
        console.log("🔍 _fetchUserMenus: Number of rolePrivilegeIds:", rolePrivilegeIds?.length || 0);
        if (!rolePrivilegeIds || rolePrivilegeIds.length === 0) {
            console.warn("⚠️ _fetchUserMenus: No rolePrivilegeIds provided, returning empty menus");
            return [];
        }
        const objectIds = rolePrivilegeIds.map(id => {
            try {
                return new mongoose_1.Types.ObjectId(id);
            }
            catch (err) {
                console.error(`❌ _fetchUserMenus: Invalid ObjectId: ${id}`, err);
                return null;
            }
        }).filter(id => id !== null);
        console.log("🔍 _fetchUserMenus: Converted to ObjectIds:", objectIds);
        // Fetch menuGroupIds from RolePrivileges
        console.log("🔍 _fetchUserMenus: Querying RolePrivileges with _id $in:", objectIds);
        const privileges = await rolePrivilegeModel_1.RolePrivilgeModel.find({
            _id: { $in: objectIds },
            status: true,
            isDeleted: false
        }).select("menuGroupId").lean();
        console.log("🔍 _fetchUserMenus: Privileges found:", privileges);
        const menuGroupIds = privileges.map((p) => p.menuGroupId.toString());
        console.log("🔍 _fetchUserMenus: menuGroupIds:", menuGroupIds);
        if (!menuGroupIds.length) {
            console.warn("⚠️ _fetchUserMenus: No valid menuGroupIds found, returning empty menus");
            return [];
        }
        // Fetch groups matching menuGroupIds
        console.log("🔍 _fetchUserMenus: Querying GroupModel with _id $in:", menuGroupIds);
        const groups = await menuGroupModel_1.GroupModel.find({
            _id: { $in: menuGroupIds.map(id => new mongoose_1.Types.ObjectId(id)) },
            status: "active",
            isDeleted: false
        })
            .populate({
            path: "submenuId",
            match: { status: "active", isDeleted: false },
            select: "name slug path mainMenuId sortOrder",
            populate: {
                path: "mainMenuId",
                match: { status: "active", isDeleted: false },
                select: "name slug icon sequenceOrder"
            }
        })
            .lean();
        console.log("🔍 _fetchUserMenus: Groups found:", groups.length);
        if (groups.length === 0) {
            console.warn("⚠️ _fetchUserMenus: No groups found for menuGroupIds:", menuGroupIds);
            return [];
        }
        // Organize menus and submenus with optimized deduplication
        const menuMap = {};
        const seenSubmenuKeys = new Set(); // Track slug-path combinations
        for (const group of groups) {
            const submenu = group.submenuId;
            if (!submenu ||
                (typeof submenu === "object" && "toHexString" in submenu && mongoose_1.Types.ObjectId.isValid(submenu)) ||
                (typeof submenu === "object" && "_id" in submenu && mongoose_1.Types.ObjectId.isValid(submenu._id) && !submenu.mainMenuId)) {
                console.warn("⚠️ _fetchUserMenus: Skipping group due to missing or invalid submenu/mainMenuId:", group);
                continue;
            }
            const populatedSubmenu = submenu;
            const mainMenu = populatedSubmenu.mainMenuId;
            const menuKey = mainMenu.slug;
            const submenuKey = `${populatedSubmenu.slug}-${populatedSubmenu.path}`;
            // Only process if menu doesn't exist yet
            if (!menuMap[menuKey]) {
                menuMap[menuKey] = {
                    name: mainMenu.name,
                    slug: mainMenu.slug,
                    icon: mainMenu.icon || "RiListIndefinite",
                    sequenceOrder: mainMenu.sequenceOrder,
                    children: [],
                    special: mainMenu.slug === "dashboard"
                };
                console.log("🔍 _fetchUserMenus: Added main menu to menuMap:", menuMap[menuKey]);
            }
            // Add submenu only if not seen before
            if (populatedSubmenu.path && !seenSubmenuKeys.has(submenuKey)) {
                const submenuItem = {
                    name: populatedSubmenu.name,
                    slug: populatedSubmenu.slug,
                    path: populatedSubmenu.path,
                    sortOrder: populatedSubmenu.sortOrder
                };
                menuMap[menuKey].children.push(submenuItem);
                seenSubmenuKeys.add(submenuKey);
                console.log("🔍 _fetchUserMenus: Added submenu - Name:", populatedSubmenu.name, "Slug:", populatedSubmenu.slug, "Path:", populatedSubmenu.path, "SortOrder:", populatedSubmenu.sortOrder);
            }
            else if (mainMenu.slug === "dashboard" && !menuMap[menuKey].path) {
                menuMap[menuKey].path = "/";
                console.log("🔍 _fetchUserMenus: Set Dashboard path to /");
            }
        }
        const menus = Object.values(menuMap).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
        console.log("🔍 _fetchUserMenus: Final menus array:", menus);
        for (const menu of menus) {
            if (menu.children && menu.children.length > 0) {
                menu.children.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                console.log(`🔍 _fetchUserMenus: Sorted submenus for ${menu.name}:`, menu.children);
            }
        }
        console.log("🔍 _fetchUserMenus: Returning menus:", menus);
        return menus;
    }
    _generateToken(user) {
        console.log("🔍 _generateToken: Generating token for user:", user.email);
        const jwtSecret = process.env.JWT_SECRET;
        const validExpireTimes = ["1d", "2d", "1h", "2h", "30m", "1m"];
        const expiresIn = process.env.JWT_EXPIRE_TIME && validExpireTimes.includes(process.env.JWT_EXPIRE_TIME)
            ? process.env.JWT_EXPIRE_TIME
            : "1d";
        console.log("🔍 _generateToken: Using expiresIn:", expiresIn);
        const signOptions = {
            expiresIn: expiresIn,
        };
        const token = (0, jsonwebtoken_1.sign)({ _id: user._id, id: user._id, email: user.email, role: user.role }, jwtSecret, signOptions);
        const { password: _, rolePrivilegeIds: __, ...userWithoutPassword } = user;
        console.log("🔍 _generateToken: Token generated successfully");
        return { token, data: userWithoutPassword, expiresIn: expiresIn };
    }
}
exports.default = new AuthenticationRepository();
