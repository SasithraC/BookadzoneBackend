import { CommonService } from "../commonService";
import { CommonRepository } from "../../repositories/commonRepository";

jest.mock("../../repositories/commonRepository");

const mockModel = {} as any;

describe("CommonService", () => {
  let service: CommonService<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommonService(mockModel);
  });

  it("toggleStatus should call repository.toggleStatus", async () => {
    (CommonRepository.prototype.toggleStatus as any).mockResolvedValue("ok");
    const result = await service.toggleStatus("id1");
    expect(CommonRepository.prototype.toggleStatus).toHaveBeenCalledWith("id1");
    expect(result).toBe("ok");
  });

  it("getStats should call repository.getStats", async () => {
    (CommonRepository.prototype.getStats as any).mockResolvedValue({ total: 1 });
    const result = await service.getStats();
    expect(CommonRepository.prototype.getStats).toHaveBeenCalled();
    expect(result).toEqual({ total: 1 });
  });

  it("existsByField should call repository.existsByField", async () => {
    (CommonRepository.prototype.existsByField as any).mockResolvedValue(true);
    const result = await service.existsByField("slug", "val");
    expect(CommonRepository.prototype.existsByField).toHaveBeenCalledWith("slug", "val");
    expect(result).toBe(true);
  });
});