import configRepository from "../configRepository";
import { ConfigModel } from "../../models/configModel";
import { CommonRepository } from "../common.repository";

jest.mock("../../models/configModel");
jest.mock("../common.repository");

const mockConfig = { _id: "1", name: "Test", isDeleted: false, status: "active" };

describe("ConfigRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createConfig should call ConfigModel.create", async () => {
    (ConfigModel.create as any).mockResolvedValue(mockConfig);
    const result = await configRepository.createConfig(mockConfig as any);
    expect(ConfigModel.create).toHaveBeenCalledWith(mockConfig);
    expect(result).toBe(mockConfig);
  });

  it("getAllConfigs should query with isDeleted false and call getStats", async () => {
  (ConfigModel.find as any).mockReturnValue({ skip: () => ({ limit: jest.fn().mockResolvedValue([mockConfig]) }) });
  jest.spyOn(CommonRepository.prototype, "getStats").mockResolvedValue({ total: 1, active: 1, inactive: 0 });
    const result = await configRepository.getAllConfigs(1, 10, "active");
    expect(ConfigModel.find).toHaveBeenCalledWith({ isDeleted: false, status: "active" });
    expect(result.data).toBeDefined();
    expect(result.meta.totalPages).toBe(1);
  });

  it("getConfigById should call findById", async () => {
    (ConfigModel.findById as any).mockResolvedValue(mockConfig);
    const result = await configRepository.getConfigById("1");
    expect(ConfigModel.findById).toHaveBeenCalledWith("1");
    expect(result).toBe(mockConfig);
  });

  it("updateConfig should call findByIdAndUpdate", async () => {
    (ConfigModel.findByIdAndUpdate as any).mockResolvedValue(mockConfig);
    const result = await configRepository.updateConfig("1", { name: "New" });
    expect(ConfigModel.findByIdAndUpdate).toHaveBeenCalledWith("1", { name: "New" }, { new: true });
    expect(result).toBe(mockConfig);
  });

  it("softDeleteConfig should set isDeleted true", async () => {
    (ConfigModel.findByIdAndUpdate as any).mockResolvedValue(mockConfig);
    const result = await configRepository.softDeleteConfig("1");
    expect(ConfigModel.findByIdAndUpdate).toHaveBeenCalledWith("1", { isDeleted: true }, { new: true });
    expect(result).toBe(mockConfig);
  });

  it("toggleStatus should call commonRepository.toggleStatus", async () => {
    jest.spyOn(CommonRepository.prototype, "toggleStatus").mockResolvedValue(mockConfig);
    const result = await configRepository.toggleStatus("1");
    expect(CommonRepository.prototype.toggleStatus).toHaveBeenCalledWith("1");
    expect(result).toBe(mockConfig);
  });

  it("restoreConfig should set isDeleted false and status active", async () => {
    (ConfigModel.findByIdAndUpdate as any).mockResolvedValue(mockConfig);
    const result = await configRepository.restoreConfig("1");
    expect(ConfigModel.findByIdAndUpdate).toHaveBeenCalledWith("1", { isDeleted: false, status: "active" }, { new: true });
    expect(result).toBe(mockConfig);
  });

  it("deleteConfigPermanently should call findByIdAndDelete", async () => {
    (ConfigModel.findByIdAndDelete as any).mockResolvedValue(mockConfig);
    const result = await configRepository.deleteConfigPermanently("1");
    expect(ConfigModel.findByIdAndDelete).toHaveBeenCalledWith("1");
    expect(result).toBe(mockConfig);
  });

  it("getAllTrashConfigs should query with isDeleted true and call getStats", async () => {
  (ConfigModel.find as any).mockReturnValue({ skip: () => ({ limit: jest.fn().mockResolvedValue([mockConfig]) }) });
  (ConfigModel.countDocuments as any).mockResolvedValue(1);
  jest.spyOn(CommonRepository.prototype, "getStats").mockResolvedValue({ total: 1, active: 0, inactive: 1 });
    const result = await configRepository.getAllTrashConfigs(1, 10, "inactive");
    expect(ConfigModel.find).toHaveBeenCalledWith({ isDeleted: true, status: "inactive" });
    expect(ConfigModel.countDocuments).toHaveBeenCalledWith({ isDeleted: true, status: "inactive" });
    expect(result.data).toBeDefined();
    expect(result.meta.totalPages).toBe(1);
  });
});