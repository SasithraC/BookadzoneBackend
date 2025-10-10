"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonService_1 = require("../commonService");
const commonRepository_1 = require("../../repositories/commonRepository");
jest.mock("../../repositories/common.repository");
const mockModel = {};
describe("CommonService", () => {
    let service;
    beforeEach(() => {
        jest.clearAllMocks();
        service = new commonService_1.CommonService(mockModel);
    });
    it("toggleStatus should call repository.toggleStatus", async () => {
        commonRepository_1.CommonRepository.prototype.toggleStatus.mockResolvedValue("ok");
        const result = await service.toggleStatus("id1");
        expect(commonRepository_1.CommonRepository.prototype.toggleStatus).toHaveBeenCalledWith("id1");
        expect(result).toBe("ok");
    });
    it("getStats should call repository.getStats", async () => {
        commonRepository_1.CommonRepository.prototype.getStats.mockResolvedValue({ total: 1 });
        const result = await service.getStats();
        expect(commonRepository_1.CommonRepository.prototype.getStats).toHaveBeenCalled();
        expect(result).toEqual({ total: 1 });
    });
    it("existsByField should call repository.existsByField", async () => {
        commonRepository_1.CommonRepository.prototype.existsByField.mockResolvedValue(true);
        const result = await service.existsByField("slug", "val");
        expect(commonRepository_1.CommonRepository.prototype.existsByField).toHaveBeenCalledWith("slug", "val");
        expect(result).toBe(true);
    });
});
