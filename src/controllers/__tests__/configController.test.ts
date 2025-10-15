import configController from "../configController";
import configService from "../../services/configService";
import { HTTP_RESPONSE } from "../../utils/httpResponse";

jest.mock("../../services/configService");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("ConfigController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createConfig", () => {
    it("should create config and return 201", async () => {
      (configService.createConfig as any).mockResolvedValue({ id: "1" });
      const req: any = { body: { name: "test" } };
      const res = mockRes();
      await configController.createConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Config created",
        data: { id: "1" },
      });
    });

    it("should return 409 if config exists", async () => {
      (configService.createConfig as any).mockRejectedValue(new Error("already exists"));
      const req: any = { body: { name: "test" } };
      const res = mockRes();
      await configController.createConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.FAIL,
        message: "already exists",
      });
    });

    it("should call next on other errors", async () => {
      (configService.createConfig as any).mockRejectedValue(new Error("other error"));
      const req: any = { body: { name: "test" } };
      const res = mockRes();
      await configController.createConfig(req, res, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getAllConfigs", () => {
    it("should return all configs", async () => {
      (configService.getAllConfigs as any).mockResolvedValue({ 
        data: [], 
        meta: { 
          total: 0, 
          active: 0, 
          inactive: 0, 
          totalPages: 0 
        } 
      });
      const req: any = { query: {} };
      const res = mockRes();
      await configController.getAllConfigs(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        data: [],
        meta: {
          total: 0,
          active: 0,
          inactive: 0,
          totalPages: 0,
          page: 1,
          limit: 10
        }
      });
    });
  });

  describe("getConfigById", () => {
    it("should return 400 if id missing", async () => {
      const req: any = { params: {} };
      const res = mockRes();
      await configController.getConfigById(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if config not found", async () => {
      (configService.getConfigById as any).mockResolvedValue(null);
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.getConfigById(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return config if found", async () => {
      (configService.getConfigById as any).mockResolvedValue({ id: "1" });
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.getConfigById(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        data: { id: "1" },
      });
    });
  });

  describe("updateConfig", () => {
    it("should return 400 if id missing", async () => {
      const req: any = { params: {} };
      const res = mockRes();
      await configController.updateConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if config not found", async () => {
      (configService.updateConfig as any).mockResolvedValue(null);
      const req: any = { params: { id: "1" }, body: {} };
      const res = mockRes();
      await configController.updateConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update config and return 200", async () => {
      (configService.updateConfig as any).mockResolvedValue({ id: "1" });
      const req: any = { params: { id: "1" }, body: {} };
      const res = mockRes();
      await configController.updateConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Config updated",
        data: { id: "1" },
      });
    });

    it("should return 409 if config exists", async () => {
      (configService.updateConfig as any).mockRejectedValue(new Error("already exists"));
      const req: any = { params: { id: "1" }, body: {} };
      const res = mockRes();
      await configController.updateConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe("softDeleteConfig", () => {
    it("should return 400 if id missing", async () => {
      const req: any = { params: {} };
      const res = mockRes();
      await configController.softDeleteConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if config not found", async () => {
      (configService.softDeleteConfig as any).mockResolvedValue(null);
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.softDeleteConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should soft delete config and return 200", async () => {
      (configService.softDeleteConfig as any).mockResolvedValue({ id: "1" });
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.softDeleteConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Config soft deleted",
        data: { id: "1" },
      });
    });
  });

  describe("toggleStatus", () => {
    it("should return 400 if id missing", async () => {
      const req: any = { params: {} };
      const res = mockRes();
      await configController.toggleStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if config not found", async () => {
      (configService.toggleStatus as any).mockResolvedValue(null);
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.toggleStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should toggle status and return 200", async () => {
      (configService.toggleStatus as any).mockResolvedValue({ id: "1" });
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.toggleStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Config status toggled",
        data: { id: "1" },
      });
    });
  });

  describe("getAllTrashConfigs", () => {
    it("should return trashed configs", async () => {
      (configService.getAllTrashConfigs as any).mockResolvedValue({ data: [], total: 0 });
      const req: any = { query: {} };
      const res = mockRes();
      await configController.getAllTrashConfigs(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        data: [],
        total: 0,
      });
    });
  });

  describe("restoreConfig", () => {
    it("should return 400 if id missing", async () => {
      const req: any = { params: {} };
      const res = mockRes();
      await configController.restoreConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if config not found", async () => {
      (configService.restoreConfig as any).mockResolvedValue(null);
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.restoreConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should restore config and return 200", async () => {
      (configService.restoreConfig as any).mockResolvedValue({ id: "1" });
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.restoreConfig(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Config restored successfully",
        data: { id: "1" },
      });
    });
  });

  describe("deleteConfigPermanently", () => {
    it("should return 400 if id missing", async () => {
      const req: any = { params: {} };
      const res = mockRes();
      await configController.deleteConfigPermanently(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if config not found", async () => {
      (configService.deleteConfigPermanently as any).mockResolvedValue(null);
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.deleteConfigPermanently(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should permanently delete config and return 200", async () => {
      (configService.deleteConfigPermanently as any).mockResolvedValue({ id: "1" });
      const req: any = { params: { id: "1" } };
      const res = mockRes();
      await configController.deleteConfigPermanently(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Config permanently deleted",
      });
    });
  });
});