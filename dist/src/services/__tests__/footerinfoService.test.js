"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const footerInfoService_1 = __importDefault(require("../footerInfoService"));
describe("FooterService", () => {
    it("throws if logo missing", async () => {
        await expect(footerInfoService_1.default.createFooterInfo({
            description: "test",
            isDeleted: false,
        })).rejects.toThrow("Logo file is required for creation");
    });
    it("throws if description missing", async () => {
        await expect(footerInfoService_1.default.createFooterInfo({ isDeleted: false }, { filename: "logo.png" })).rejects.toThrow(/description is required/);
    });
    it("throws on invalid status", async () => {
        await expect(footerInfoService_1.default.createFooterInfo({ description: "test", status: "wrong" }, { filename: "logo.png" })).rejects.toThrow(/status must be one of/);
    });
});
