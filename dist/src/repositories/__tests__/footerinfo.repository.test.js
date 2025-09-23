"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const footerInfoRepository_1 = __importDefault(require("../footerInfoRepository"));
const env_1 = require("../../config/env");
beforeAll(async () => {
    await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe("FooterInfoRepository", () => {
    let footerInfoId = "";
    it("createFooterInfo creates FooterInfo", async () => {
        const footerInfo = await footerInfoRepository_1.default.createFooterInfo({
            logo: "test-logo.png",
            description: "Test description",
            socialmedia: "facebook",
            socialmedialinks: "https://facebook.com/test",
            google: "https://google.com/test",
            appstore: "https://appstore.com/test",
            status: "active",
            priority: 1,
            isDeleted: false,
        });
        expect(footerInfo.logo).toBe("test-logo.png");
        expect(footerInfo.description).toBe("Test description");
        // @ts-ignore
        footerInfoId = footerInfo._id.toString();
    });
    it("getFooterInfoById finds FooterInfo", async () => {
        const found = await footerInfoRepository_1.default.getFooterInfoById(footerInfoId);
        expect(found && found._id.toString()).toBe(footerInfoId);
    });
    it("updateFooterInfo updates FooterInfo", async () => {
        const updated = await footerInfoRepository_1.default.updateFooterInfo(footerInfoId, {
            description: "Updated description",
        });
        expect(updated?.description).toBe("Updated description");
    });
    it("softDeleteFooterInfo marks FooterInfo as deleted", async () => {
        const deleted = await footerInfoRepository_1.default.softDeleteFooterInfo(footerInfoId);
        expect(deleted?.isDeleted).toBe(true);
    });
    it("restoreFooterInfo recovers FooterInfo", async () => {
        const restored = await footerInfoRepository_1.default.restoreFooterInfo(footerInfoId);
        expect(restored?.isDeleted).toBe(false);
        expect(restored?.status).toBe("active");
    });
    it("toggleStatus switches FooterInfo status", async () => {
        const toggled = await footerInfoRepository_1.default.toggleStatus(footerInfoId);
        expect(["active", "inactive"]).toContain(toggled?.status);
    });
    it("getFooterInfo returns paginated FooterInfos", async () => {
        const result = await footerInfoRepository_1.default.getFooterInfo(1, 10);
        expect(result).toHaveProperty("data");
        expect(result).toHaveProperty("meta");
        expect(Array.isArray(result.data)).toBe(true);
    });
    it("getAllTrashFooterInfos returns deleted FooterInfos", async () => {
        // First soft delete to make sure it's in trash
        await footerInfoRepository_1.default.softDeleteFooterInfo(footerInfoId);
        const result = await footerInfoRepository_1.default.getAllTrashFooterInfos(1, 10);
        expect(result).toHaveProperty("data");
        expect(result).toHaveProperty("meta");
        expect(Array.isArray(result.data)).toBe(true);
    });
    it("deleteFooterInfoPermanently removes FooterInfo", async () => {
        const del = await footerInfoRepository_1.default.deleteFooterInfoPermanently(footerInfoId);
        expect(del).not.toBeNull();
    });
});
