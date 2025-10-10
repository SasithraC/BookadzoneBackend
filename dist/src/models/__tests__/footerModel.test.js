"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const footerinfoModel_1 = require("../footerinfoModel");
const env_1 = require("../../config/env");
beforeAll(async () => { await mongoose_1.default.connect(env_1.ENV.MONGO_URI); });
afterAll(async () => { await mongoose_1.default.connection.close(); });
describe('FooterInfoModel', () => {
    it('requires logo and description', async () => {
        const footer = new footerinfoModel_1.FooterInfoModel({});
        let error;
        try {
            await footer.save();
        }
        catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        if (error && typeof error === 'object' && 'errors' in error) {
            const err = error;
            expect(err.errors.logo).toBeDefined();
            expect(err.errors.description).toBeDefined();
        }
    });
    it('defaults status, isDeleted and priority', async () => {
        const footer = await footerinfoModel_1.FooterInfoModel.create({
            logo: 'logo.png',
            description: 'Footer description'
        });
        expect(footer.status).toBe('active');
        expect(footer.isDeleted).toBe(false);
        expect(footer.priority).toBe(1);
    });
    it('allows optional fields to be empty', async () => {
        const footer = await footerinfoModel_1.FooterInfoModel.create({
            logo: 'logo.png',
            description: 'Footer description'
        });
        expect(footer.socialmedia).toBe('');
        expect(footer.socialmedialinks).toBe('');
        expect(footer.google).toBe('');
        expect(footer.appstore).toBe('');
    });
});
