"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_service_1 = require("../common.service");
const common_repository_1 = require("../../repositories/common.repository");
jest.mock("../../repositories/common.repository");
const mockModel = {};
describe("CommonService", () => {
    let service;
    beforeEach(() => {
        jest.clearAllMocks();
        service = new common_service_1.CommonService(mockModel);
    });
    it("toggleStatus should call repository.toggleStatus", async () => {
        common_repository_1.CommonRepository.prototype.toggleStatus.mockResolvedValue("ok");
        const result = await service.toggleStatus("id1");
        expect(common_repository_1.CommonRepository.prototype.toggleStatus).toHaveBeenCalledWith("id1");
        expect(result).toBe("ok");
    });
    it("getStats should call repository.getStats", async () => {
        common_repository_1.CommonRepository.prototype.getStats.mockResolvedValue({ total: 1 });
        const result = await service.getStats();
        expect(common_repository_1.CommonRepository.prototype.getStats).toHaveBeenCalled();
        expect(result).toEqual({ total: 1 });
    });
    it("existsByField should call repository.existsByField", async () => {
        common_repository_1.CommonRepository.prototype.existsByField.mockResolvedValue(true);
        const result = await service.existsByField("slug", "val");
        expect(common_repository_1.CommonRepository.prototype.existsByField).toHaveBeenCalledWith("slug", "val");
        expect(result).toBe(true);
    });
});
