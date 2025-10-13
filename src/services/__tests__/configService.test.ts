import configService from "../configService";
import configRepository from "../../repositories/configRepository";
import ValidationHelper from "../../utils/validationHelper";
import { CommonService } from "../commonService";

jest.mock("../../repositories/configRepository");
jest.mock("../../utils/validationHelper");
jest.mock("../commonService");

const mockConfig = { _id: "1", name: "Test", slug: "slug", configFields: [], status: "active", isDeleted: false };

describe("ConfigService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("createConfig", () => {
    it("should throw if validation fails", async () => {
      (ValidationHelper.validate as any).mockReturnValue([{ message: "fail" }]);
      await expect(configService.createConfig({} as any)).rejects.toThrow("fail");
    });

    it("should throw if slug exists", async () => {
      (ValidationHelper.validate as any).mockReturnValue([]);
      jest.spyOn(CommonService.prototype, "existsByField").mockResolvedValue(true);
      await expect(configService.createConfig(mockConfig as any)).rejects.toThrow("Config with this slug already exists");
    });

    it("should create config if valid and slug not exists", async () => {
      (ValidationHelper.validate as any).mockReturnValue([]);
      jest.spyOn(CommonService.prototype, "existsByField").mockResolvedValue(false);
      (configRepository.createConfig as any).mockResolvedValue(mockConfig);
      const result = await configService.createConfig(mockConfig as any);
      expect(result).toBe(mockConfig);
    });
  });

  it("getAllConfigs should call repository", async () => {
    (configRepository.getAllConfigs as any).mockResolvedValue([mockConfig]);
    const result = await configService.getAllConfigs(1, 10, "active");
    expect(configRepository.getAllConfigs).toHaveBeenCalledWith(1, 10, "active");
    expect(result).toEqual([mockConfig]);
  });

  it("getConfigById should throw if invalid id", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue({ message: "bad id" });
    await expect(configService.getConfigById("bad")).rejects.toThrow("bad id");
  });

  it("getConfigById should call repository if id valid", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (configRepository.getConfigById as any).mockResolvedValue(mockConfig);
    const result = await configService.getConfigById("1");
    expect(configRepository.getConfigById).toHaveBeenCalledWith("1");
    expect(result).toBe(mockConfig);
  });

  it("updateConfig should throw if invalid id", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue({ message: "bad id" });
    await expect(configService.updateConfig("bad", {})).rejects.toThrow("bad id");
  });

  it("updateConfig should throw if validation fails", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (ValidationHelper.validate as any).mockReturnValue([{ message: "fail" }]);
    await expect(configService.updateConfig("1", {})).rejects.toThrow("fail");
  });

  it("updateConfig should throw if slug changed and exists", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (ValidationHelper.validate as any).mockReturnValue([]);
    (configRepository.getConfigById as any).mockResolvedValue({ ...mockConfig, slug: "old" });
  jest.spyOn(CommonService.prototype, "existsByField").mockResolvedValue(true);
  await expect(configService.updateConfig("1", { slug: "slug" })).rejects.toThrow("Config with this slug already exists");
  });

  it("updateConfig should update config if valid", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (ValidationHelper.validate as any).mockReturnValue([]);
    (configRepository.getConfigById as any).mockResolvedValue({ ...mockConfig, slug: "old" });
  jest.spyOn(CommonService.prototype, "existsByField").mockResolvedValue(false);
  (configRepository.updateConfig as any).mockResolvedValue(mockConfig);
  const result = await configService.updateConfig("1", { slug: "slug" });
  expect(result).toBe(mockConfig);
  });

  it("softDeleteConfig should throw if invalid id", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue({ message: "bad id" });
    await expect(configService.softDeleteConfig("bad")).rejects.toThrow("bad id");
  });

  it("softDeleteConfig should call repository if id valid", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (configRepository.softDeleteConfig as any).mockResolvedValue(mockConfig);
    const result = await configService.softDeleteConfig("1");
    expect(result).toBe(mockConfig);
  });

  it("toggleStatus should throw if invalid id", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue({ message: "bad id" });
    await expect(configService.toggleStatus("bad")).rejects.toThrow("bad id");
  });

  it("toggleStatus should call repository if id valid", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (configRepository.toggleStatus as any).mockResolvedValue(mockConfig);
    const result = await configService.toggleStatus("1");
    expect(result).toBe(mockConfig);
  });

  it("getAllTrashConfigs should call repository", async () => {
    (configRepository.getAllTrashConfigs as any).mockResolvedValue([mockConfig]);
    const result = await configService.getAllTrashConfigs(1, 10, "inactive");
    expect(configRepository.getAllTrashConfigs).toHaveBeenCalledWith(1, 10, "inactive");
    expect(result).toEqual([mockConfig]);
  });

  it("restoreConfig should throw if invalid id", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue({ message: "bad id" });
    await expect(configService.restoreConfig("bad")).rejects.toThrow("bad id");
  });

  it("restoreConfig should call repository if id valid", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (configRepository.restoreConfig as any).mockResolvedValue(mockConfig);
    const result = await configService.restoreConfig("1");
    expect(result).toBe(mockConfig);
  });

  it("deleteConfigPermanently should throw if invalid id", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue({ message: "bad id" });
    await expect(configService.deleteConfigPermanently("bad")).rejects.toThrow("bad id");
  });

  it("deleteConfigPermanently should call repository if id valid", async () => {
    (ValidationHelper.isValidObjectId as any).mockReturnValue(null);
    (configRepository.deleteConfigPermanently as any).mockResolvedValue(mockConfig);
    const result = await configService.deleteConfigPermanently("1");
    expect(result).toBe(mockConfig);
  });
});