"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configRepository_1 = __importDefault(require("../configRepository"));
const configModel_1 = require("../../models/configModel");
const common_repository_1 = require("../common.repository");
jest.mock("../../models/configModel");
jest.mock("../common.repository");
const mockConfig = { _id: "1", name: "Test", isDeleted: false, status: "active" };
describe("ConfigRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("createConfig should call ConfigModel.create", async () => {
        configModel_1.ConfigModel.create.mockResolvedValue(mockConfig);
        const result = await configRepository_1.default.createConfig(mockConfig);
        expect(configModel_1.ConfigModel.create).toHaveBeenCalledWith(mockConfig);
        expect(result).toBe(mockConfig);
    });
    it("getAllConfigs should query with isDeleted false and call getStats", async () => {
        configModel_1.ConfigModel.find.mockReturnValue({ skip: () => ({ limit: jest.fn().mockResolvedValue([mockConfig]) }) });
        jest.spyOn(common_repository_1.CommonRepository.prototype, "getStats").mockResolvedValue({ total: 1, active: 1, inactive: 0 });
        const result = await configRepository_1.default.getAllConfigs(1, 10, "active");
        expect(configModel_1.ConfigModel.find).toHaveBeenCalledWith({ isDeleted: false, status: "active" });
        expect(result.data).toBeDefined();
        expect(result.meta.totalPages).toBe(1);
    });
    it("getConfigById should call findById", async () => {
        configModel_1.ConfigModel.findById.mockResolvedValue(mockConfig);
        const result = await configRepository_1.default.getConfigById("1");
        expect(configModel_1.ConfigModel.findById).toHaveBeenCalledWith("1");
        expect(result).toBe(mockConfig);
    });
    it("updateConfig should call findByIdAndUpdate", async () => {
        configModel_1.ConfigModel.findByIdAndUpdate.mockResolvedValue(mockConfig);
        const result = await configRepository_1.default.updateConfig("1", { name: "New" });
        expect(configModel_1.ConfigModel.findByIdAndUpdate).toHaveBeenCalledWith("1", { name: "New" }, { new: true });
        expect(result).toBe(mockConfig);
    });
    it("softDeleteConfig should set isDeleted true", async () => {
        configModel_1.ConfigModel.findByIdAndUpdate.mockResolvedValue(mockConfig);
        const result = await configRepository_1.default.softDeleteConfig("1");
        expect(configModel_1.ConfigModel.findByIdAndUpdate).toHaveBeenCalledWith("1", { isDeleted: true }, { new: true });
        expect(result).toBe(mockConfig);
    });
    it("toggleStatus should call commonRepository.toggleStatus", async () => {
        jest.spyOn(common_repository_1.CommonRepository.prototype, "toggleStatus").mockResolvedValue(mockConfig);
        const result = await configRepository_1.default.toggleStatus("1");
        expect(common_repository_1.CommonRepository.prototype.toggleStatus).toHaveBeenCalledWith("1");
        expect(result).toBe(mockConfig);
    });
    it("restoreConfig should set isDeleted false and status active", async () => {
        configModel_1.ConfigModel.findByIdAndUpdate.mockResolvedValue(mockConfig);
        const result = await configRepository_1.default.restoreConfig("1");
        expect(configModel_1.ConfigModel.findByIdAndUpdate).toHaveBeenCalledWith("1", { isDeleted: false, status: "active" }, { new: true });
        expect(result).toBe(mockConfig);
    });
    it("deleteConfigPermanently should call findByIdAndDelete", async () => {
        configModel_1.ConfigModel.findByIdAndDelete.mockResolvedValue(mockConfig);
        const result = await configRepository_1.default.deleteConfigPermanently("1");
        expect(configModel_1.ConfigModel.findByIdAndDelete).toHaveBeenCalledWith("1");
        expect(result).toBe(mockConfig);
    });
    it("getAllTrashConfigs should query with isDeleted true and call getStats", async () => {
        configModel_1.ConfigModel.find.mockReturnValue({ skip: () => ({ limit: jest.fn().mockResolvedValue([mockConfig]) }) });
        configModel_1.ConfigModel.countDocuments.mockResolvedValue(1);
        jest.spyOn(common_repository_1.CommonRepository.prototype, "getStats").mockResolvedValue({ total: 1, active: 0, inactive: 1 });
        const result = await configRepository_1.default.getAllTrashConfigs(1, 10, "inactive");
        expect(configModel_1.ConfigModel.find).toHaveBeenCalledWith({ isDeleted: true, status: "inactive" });
        expect(configModel_1.ConfigModel.countDocuments).toHaveBeenCalledWith({ isDeleted: true, status: "inactive" });
        expect(result.data).toBeDefined();
        expect(result.meta.totalPages).toBe(1);
    });
});
