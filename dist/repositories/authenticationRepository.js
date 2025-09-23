"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthenticationRepository {
    async authLogin(data) {
        const { email, password } = data;
        const user = await userModel_1.default
            .findOne({ email })
            .select("_id email password role status")
            .lean();
        if (!user) {
            throw new Error("Email does not exist");
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password for user");
        }
        return this._generateToken(user);
    }
    async refreshToken(token) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET not defined in environment");
        }
        let decoded;
        try {
            decoded = (0, jsonwebtoken_1.verify)(token, jwtSecret);
        }
        catch (err) {
            throw new Error("Invalid or expired token");
        }
        const userId = decoded._id || decoded.id;
        const user = await userModel_1.default.findOne({ _id: userId }).select("_id email role status").lean();
        if (!user) {
            throw new Error("User not found");
        }
        return this._generateToken(user);
    }
    _generateToken(user) {
        const jwtSecret = process.env.JWT_SECRET;
        const validExpireTimes = ["1d", "2d", "1h", "2h", "30m", "1m"];
        const expiresIn = process.env.JWT_EXPIRE_TIME && validExpireTimes.includes(process.env.JWT_EXPIRE_TIME)
            ? process.env.JWT_EXPIRE_TIME
            : "1d";
        const signOptions = {
            expiresIn: expiresIn,
        };
        const token = (0, jsonwebtoken_1.sign)({ _id: user._id, id: user._id, email: user.email, role: user.role }, jwtSecret, signOptions);
        const { password: _, ...userWithoutPassword } = user;
        return { token, data: userWithoutPassword, expiresIn: expiresIn };
    }
}
exports.default = new AuthenticationRepository();
