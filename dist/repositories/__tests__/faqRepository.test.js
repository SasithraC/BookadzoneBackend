"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faqRepository_1 = __importDefault(require("../faqRepository"));
const env_1 = require("../../config/env");
beforeAll(async () => {
    await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
describe('FaqRepository', () => {
    let faqId = '';
    it('createFaq creates FAQ', async () => {
        const faq = await faqRepository_1.default.createFaq({ question: 'RepoTest', answer: 'RepoAnswer', status: 'active', isDeleted: false });
        expect(faq.question).toBe('RepoTest');
        expect(faq.answer).toBe('RepoAnswer');
        // @ts-ignore
        faqId = faq._id.toString();
    });
    it('getFaqById finds FAQ', async () => {
        const found = await faqRepository_1.default.getFaqById(faqId);
        expect(found && found._id.toString()).toBe(faqId);
    });
    it('updateFaq updates FAQ', async () => {
        const updated = await faqRepository_1.default.updateFaq(faqId, { answer: 'Updated RepoAnswer' });
        expect(updated?.answer).toBe('Updated RepoAnswer');
    });
    it('softDeleteFaq marks FAQ as deleted', async () => {
        const deleted = await faqRepository_1.default.softDeleteFaq(faqId);
        expect(deleted?.isDeleted).toBe(true);
    });
    it('restoreFaq recovers FAQ', async () => {
        const restored = await faqRepository_1.default.restoreFaq(faqId);
        expect(restored?.isDeleted).toBe(false);
    });
    it('deleteFaqPermanently removes FAQ', async () => {
        const del = await faqRepository_1.default.deleteFaqPermanently(faqId);
        expect(del).not.toBeNull();
    });
});
