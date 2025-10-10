"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configService_1 = __importDefault(require("../configService"));
const configRepository_1 = __importDefault(require("../../repositories/configRepository"));
const validationHelper_1 = __importDefault(require("../../utils/validationHelper"));
const commonService_1 = require("../commonService");
jest.mock("../../repositories/configRepository");
jest.mock("../../utils/validationHelper");
jest.mock("../common.service");
const mockConfig = { _id: "1", name: "Test", slug: "slug", configFields: [], status: "active", isDeleted: false };
describe("ConfigService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe("createConfig", () => {
        it("should throw if validation fails", async () => {
            validationHelper_1.default.validate.mockReturnValue([{ message: "fail" }]);
            await expect(configService_1.default.createConfig({})).rejects.toThrow("fail");
        });
        it("should throw if slug exists", async () => {
            validationHelper_1.default.validate.mockReturnValue([]);
            jest.spyOn(commonService_1.CommonService.prototype, "existsByField").mockResolvedValue(true);
            await expect(configService_1.default.createConfig(mockConfig)).rejects.toThrow("Config with this slug already exists");
        });
        it("should create config if valid and slug not exists", async () => {
            validationHelper_1.default.validate.mockReturnValue([]);
            jest.spyOn(commonService_1.CommonService.prototype, "existsByField").mockResolvedValue(false);
            configRepository_1.default.createConfig.mockResolvedValue(mockConfig);
            const result = await configService_1.default.createConfig(mockConfig);
            expect(result).toBe(mockConfig);
        });
    });
    it("getAllConfigs should call repository", async () => {
        configRepository_1.default.getAllConfigs.mockResolvedValue([mockConfig]);
        const result = await configService_1.default.getAllConfigs(1, 10, "active");
        expect(configRepository_1.default.getAllConfigs).toHaveBeenCalledWith(1, 10, "active");
        expect(result).toEqual([mockConfig]);
    });
    it("getConfigById should throw if invalid id", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue({ message: "bad id" });
        await expect(configService_1.default.getConfigById("bad")).rejects.toThrow("bad id");
    });
    it("getConfigById should call repository if id valid", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        configRepository_1.default.getConfigById.mockResolvedValue(mockConfig);
        const result = await configService_1.default.getConfigById("1");
        expect(configRepository_1.default.getConfigById).toHaveBeenCalledWith("1");
        expect(result).toBe(mockConfig);
    });
    it("updateConfig should throw if invalid id", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue({ message: "bad id" });
        await expect(configService_1.default.updateConfig("bad", {})).rejects.toThrow("bad id");
    });
    it("updateConfig should throw if validation fails", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        validationHelper_1.default.validate.mockReturnValue([{ message: "fail" }]);
        await expect(configService_1.default.updateConfig("1", {})).rejects.toThrow("fail");
    });
    it("updateConfig should throw if slug changed and exists", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        validationHelper_1.default.validate.mockReturnValue([]);
        configRepository_1.default.getConfigById.mockResolvedValue({ ...mockConfig, slug: "old" });
        jest.spyOn(commonService_1.CommonService.prototype, "existsByField").mockResolvedValue(true);
        await expect(configService_1.default.updateConfig("1", { slug: "slug" })).rejects.toThrow("Config with this slug already exists");
    });
    it("updateConfig should update config if valid", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        validationHelper_1.default.validate.mockReturnValue([]);
        configRepository_1.default.getConfigById.mockResolvedValue({ ...mockConfig, slug: "old" });
        jest.spyOn(commonService_1.CommonService.prototype, "existsByField").mockResolvedValue(false);
        configRepository_1.default.updateConfig.mockResolvedValue(mockConfig);
        const result = await configService_1.default.updateConfig("1", { slug: "slug" });
        expect(result).toBe(mockConfig);
    });
    it("softDeleteConfig should throw if invalid id", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue({ message: "bad id" });
        await expect(configService_1.default.softDeleteConfig("bad")).rejects.toThrow("bad id");
    });
    it("softDeleteConfig should call repository if id valid", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        configRepository_1.default.softDeleteConfig.mockResolvedValue(mockConfig);
        const result = await configService_1.default.softDeleteConfig("1");
        expect(result).toBe(mockConfig);
    });
    it("toggleStatus should throw if invalid id", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue({ message: "bad id" });
        await expect(configService_1.default.toggleStatus("bad")).rejects.toThrow("bad id");
    });
    it("toggleStatus should call repository if id valid", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        configRepository_1.default.toggleStatus.mockResolvedValue(mockConfig);
        const result = await configService_1.default.toggleStatus("1");
        expect(result).toBe(mockConfig);
    });
    it("getAllTrashConfigs should call repository", async () => {
        configRepository_1.default.getAllTrashConfigs.mockResolvedValue([mockConfig]);
        const result = await configService_1.default.getAllTrashConfigs(1, 10, "inactive");
        expect(configRepository_1.default.getAllTrashConfigs).toHaveBeenCalledWith(1, 10, "inactive");
        expect(result).toEqual([mockConfig]);
    });
    it("restoreConfig should throw if invalid id", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue({ message: "bad id" });
        await expect(configService_1.default.restoreConfig("bad")).rejects.toThrow("bad id");
    });
    it("restoreConfig should call repository if id valid", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        configRepository_1.default.restoreConfig.mockResolvedValue(mockConfig);
        const result = await configService_1.default.restoreConfig("1");
        expect(result).toBe(mockConfig);
    });
    it("deleteConfigPermanently should throw if invalid id", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue({ message: "bad id" });
        await expect(configService_1.default.deleteConfigPermanently("bad")).rejects.toThrow("bad id");
    });
    it("deleteConfigPermanently should call repository if id valid", async () => {
        validationHelper_1.default.isValidObjectId.mockReturnValue(null);
        configRepository_1.default.deleteConfigPermanently.mockResolvedValue(mockConfig);
        const result = await configService_1.default.deleteConfigPermanently("1");
        expect(result).toBe(mockConfig);
    });
});
