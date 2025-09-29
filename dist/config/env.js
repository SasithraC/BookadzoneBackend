"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
require("dotenv/config");
exports.ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME || ""
};
