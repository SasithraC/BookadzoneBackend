"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const faqSeeder_1 = __importDefault(require("./faqSeeder"));
const configSeeder_1 = __importDefault(require("./configSeeder"));
const settingsSeeder_1 = __importDefault(require("./settingsSeeder"));
const blogCategorySeeder_1 = __importDefault(require("./blogCategorySeeder"));
const categorySeeder_1 = __importDefault(require("./categorySeeder"));
const bannerSeeder_1 = __importDefault(require("./bannerSeeder"));
const pageSeeder_1 = __importDefault(require("./pageSeeder"));
const seedAll = async () => {
    try {
        if (!env_1.ENV.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
        console.log("Connected to MongoDB");
        await (0, faqSeeder_1.default)();
        await (0, configSeeder_1.default)();
        await (0, settingsSeeder_1.default)();
        await (0, categorySeeder_1.default)();
        await (0, faqSeeder_1.default)();
        await (0, configSeeder_1.default)();
        await (0, settingsSeeder_1.default)();
        await (0, blogCategorySeeder_1.default)();
        await (0, bannerSeeder_1.default)();
        await (0, pageSeeder_1.default)();
        console.log("All seeders executed successfully");
        await mongoose_1.default.connection.close();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Seeding failed:", error.message);
        }
        else {
            console.error("Seeding failed:", error);
        }
        await mongoose_1.default.connection.close();
        process.exit(1);
    }
};
seedAll();
