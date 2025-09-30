"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configController_1 = __importDefault(require("../configController"));
const configService_1 = __importDefault(require("../../services/configService"));
const httpResponse_1 = require("../../utils/httpResponse");
jest.mock("../../services/configService");
const mockRes = () => {
    const res = {};
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
            configService_1.default.createConfig.mockResolvedValue({ id: "1" });
            const req = { body: { name: "test" } };
            const res = mockRes();
            await configController_1.default.createConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Config created",
                data: { id: "1" },
            });
        });
        it("should return 409 if config exists", async () => {
            configService_1.default.createConfig.mockRejectedValue(new Error("already exists"));
            const req = { body: { name: "test" } };
            const res = mockRes();
            await configController_1.default.createConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.FAIL,
                message: "already exists",
            });
        });
        it("should call next on other errors", async () => {
            configService_1.default.createConfig.mockRejectedValue(new Error("other error"));
            const req = { body: { name: "test" } };
            const res = mockRes();
            await configController_1.default.createConfig(req, res, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
    });
    describe("getAllConfigs", () => {
        it("should return all configs", async () => {
            configService_1.default.getAllConfigs.mockResolvedValue({ data: [], total: 0 });
            const req = { query: {} };
            const res = mockRes();
            await configController_1.default.getAllConfigs(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                data: [],
                total: 0,
            });
        });
    });
    describe("getConfigById", () => {
        it("should return 400 if id missing", async () => {
            const req = { params: {} };
            const res = mockRes();
            await configController_1.default.getConfigById(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it("should return 404 if config not found", async () => {
            configService_1.default.getConfigById.mockResolvedValue(null);
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.getConfigById(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it("should return config if found", async () => {
            configService_1.default.getConfigById.mockResolvedValue({ id: "1" });
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.getConfigById(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                data: { id: "1" },
            });
        });
    });
    describe("updateConfig", () => {
        it("should return 400 if id missing", async () => {
            const req = { params: {} };
            const res = mockRes();
            await configController_1.default.updateConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it("should return 404 if config not found", async () => {
            configService_1.default.updateConfig.mockResolvedValue(null);
            const req = { params: { id: "1" }, body: {} };
            const res = mockRes();
            await configController_1.default.updateConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it("should update config and return 200", async () => {
            configService_1.default.updateConfig.mockResolvedValue({ id: "1" });
            const req = { params: { id: "1" }, body: {} };
            const res = mockRes();
            await configController_1.default.updateConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Config updated",
                data: { id: "1" },
            });
        });
        it("should return 409 if config exists", async () => {
            configService_1.default.updateConfig.mockRejectedValue(new Error("already exists"));
            const req = { params: { id: "1" }, body: {} };
            const res = mockRes();
            await configController_1.default.updateConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(409);
        });
    });
    describe("softDeleteConfig", () => {
        it("should return 400 if id missing", async () => {
            const req = { params: {} };
            const res = mockRes();
            await configController_1.default.softDeleteConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it("should return 404 if config not found", async () => {
            configService_1.default.softDeleteConfig.mockResolvedValue(null);
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.softDeleteConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it("should soft delete config and return 200", async () => {
            configService_1.default.softDeleteConfig.mockResolvedValue({ id: "1" });
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.softDeleteConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Config soft deleted",
                data: { id: "1" },
            });
        });
    });
    describe("toggleStatus", () => {
        it("should return 400 if id missing", async () => {
            const req = { params: {} };
            const res = mockRes();
            await configController_1.default.toggleStatus(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it("should return 404 if config not found", async () => {
            configService_1.default.toggleStatus.mockResolvedValue(null);
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.toggleStatus(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it("should toggle status and return 200", async () => {
            configService_1.default.toggleStatus.mockResolvedValue({ id: "1" });
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.toggleStatus(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Config status toggled",
                data: { id: "1" },
            });
        });
    });
    describe("getAllTrashConfigs", () => {
        it("should return trashed configs", async () => {
            configService_1.default.getAllTrashConfigs.mockResolvedValue({ data: [], total: 0 });
            const req = { query: {} };
            const res = mockRes();
            await configController_1.default.getAllTrashConfigs(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                data: [],
                total: 0,
            });
        });
    });
    describe("restoreConfig", () => {
        it("should return 400 if id missing", async () => {
            const req = { params: {} };
            const res = mockRes();
            await configController_1.default.restoreConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it("should return 404 if config not found", async () => {
            configService_1.default.restoreConfig.mockResolvedValue(null);
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.restoreConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it("should restore config and return 200", async () => {
            configService_1.default.restoreConfig.mockResolvedValue({ id: "1" });
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.restoreConfig(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Config restored successfully",
                data: { id: "1" },
            });
        });
    });
    describe("deleteConfigPermanently", () => {
        it("should return 400 if id missing", async () => {
            const req = { params: {} };
            const res = mockRes();
            await configController_1.default.deleteConfigPermanently(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it("should return 404 if config not found", async () => {
            configService_1.default.deleteConfigPermanently.mockResolvedValue(null);
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.deleteConfigPermanently(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it("should permanently delete config and return 200", async () => {
            configService_1.default.deleteConfigPermanently.mockResolvedValue({ id: "1" });
            const req = { params: { id: "1" } };
            const res = mockRes();
            await configController_1.default.deleteConfigPermanently(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: httpResponse_1.HTTP_RESPONSE.SUCCESS,
                message: "Config permanently deleted",
            });
        });
    });
});
