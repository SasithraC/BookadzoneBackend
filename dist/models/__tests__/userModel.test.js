"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../userModel"));
const env_1 = require("../../config/env");
beforeAll(async () => {
    await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe('UserModel', () => {
    beforeEach(async () => {
        await userModel_1.default.deleteMany({});
    });
    it('requires email and password', async () => {
        const user = new userModel_1.default({});
        let error;
        try {
            await user.save();
        }
        catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        if (error && typeof error === 'object' && 'errors' in error) {
            const err = error;
            expect(err.errors.email).toBeDefined();
            expect(err.errors.password).toBeDefined();
        }
    });
    it('defaults role, status, isDeleted', async () => {
        const user = await userModel_1.default.create({ email: 'test@test.com', password: 'admin@123' });
        expect(user.role).toBe('super-admin');
        expect(user.status).toBe('active');
        expect(user.isDeleted).toBe(false);
    });
});
