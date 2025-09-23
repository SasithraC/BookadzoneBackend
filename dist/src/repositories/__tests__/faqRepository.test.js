"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faqRepository_1 = __importDefault(require("../faqRepository"));
const env_1 = require("../../config/env");
beforeAll(async () => { await mongoose_1.default.connect(env_1.ENV.MONGO_URI); });
afterAll(async () => { await mongoose_1.default.connection.close(); });
describe("FaqRepository", () => {
    let faqId;
    it("creates FAQ", async () => {
        const faq = await faqRepository_1.default.createFaq({ question: "RepoTest", answer: "RepoAnswer", status: "active", isDeleted: false });
        expect(faq.question).toBe("RepoTest");
        expect(faq.answer).toBe("RepoAnswer");
        // @ts-ignore
        faqId = faq.id?.toString();
    });
    it("gets FAQ by ID", async () => {
        const found = await faqRepository_1.default.getFaqById(faqId);
        expect(found && found.id?.toString()).toBe(faqId);
    });
    it("updates FAQ", async () => {
        const updated = await faqRepository_1.default.updateFaq(faqId, { answer: "Updated RepoAnswer" });
        expect(updated?.answer).toBe("Updated RepoAnswer");
    });
    it("soft deletes FAQ", async () => {
        const deleted = await faqRepository_1.default.softDeleteFaq(faqId);
        expect(deleted?.isDeleted).toBe(true);
    });
    it("restores FAQ", async () => {
        const restored = await faqRepository_1.default.restoreFaq(faqId);
        expect(restored?.isDeleted).toBe(false);
    });
});
