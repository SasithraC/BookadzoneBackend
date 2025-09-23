"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const configModel_1 = require("../configModel");
const env_1 = require("../../config/env");
beforeAll(async () => { await mongoose_1.default.connect(env_1.ENV.MONGO_URI); });
afterAll(async () => { await mongoose_1.default.connection.close(); });
describe("ConfigModel", () => {
    beforeEach(async () => { await configModel_1.ConfigModel.deleteMany({}); });
    it("requires name and slug", async () => {
        const config = new configModel_1.ConfigModel({});
        let error;
        try {
            await config.save();
        }
        catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        if (error && typeof error === "object" && "errors" in error) {
            const err = error;
            expect(err.errors.name).toBeDefined();
            expect(err.errors.slug).toBeDefined();
        }
    });
    it("can create config with required fields", async () => {
        const config = await configModel_1.ConfigModel.create({
            name: "Site Title",
            slug: "site-title",
            configFields: [{ key: "title", value: "My Site" }]
        });
        expect(config.name).toBe("Site Title");
        expect(config.slug).toBe("site-title");
        expect(config.isDeleted).toBe(false);
        expect(config.status).toBe("active");
    });
});
