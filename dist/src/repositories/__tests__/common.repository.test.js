"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commonRepository_1 = require("../commonRepository");
const faqModel_1 = require("../../models/faqModel");
const env_1 = require("../../config/env");
beforeAll(async () => {
    await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
const repo = new commonRepository_1.CommonRepository(faqModel_1.FaqModel);
describe('CommonRepository', () => {
    it('existsByField returns false if none', async () => {
        const exists = await repo.existsByField('question', 'no_such_question');
        expect(exists).toBe(false);
    });
    it('toggleStatus toggles status', async () => {
        const faq = await faqModel_1.FaqModel.create({ question: 'Toggle?', answer: 'Toggle answer' });
        const toggled = await repo.toggleStatus((faq._id instanceof mongoose_1.default.Types.ObjectId ? faq._id.toString() : String(faq._id)));
        expect(toggled).not.toBeNull();
        expect(['active', 'inactive']).toContain(toggled.status);
    });
    it('getStats returns counts', async () => {
        const stats = await repo.getStats();
        expect(stats).toHaveProperty('total');
        expect(stats).toHaveProperty('active');
        expect(stats).toHaveProperty('inactive');
    });
});
