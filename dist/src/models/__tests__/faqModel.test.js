"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faqModel_1 = require("../faqModel");
const env_1 = require("../../config/env");
beforeAll(async () => { await mongoose_1.default.connect(env_1.ENV.MONGO_URI); });
afterAll(async () => { await mongoose_1.default.connection.close(); });
describe("FaqModel", () => {
    it("requires question and answer", async () => {
        const faq = new faqModel_1.FaqModel({});
        let error;
        try {
            await faq.save();
        }
        catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
        if (error && typeof error === "object" && "errors" in error) {
            const err = error;
            expect(err.errors.question).toBeDefined();
            expect(err.errors.answer).toBeDefined();
        }
    });
    it("defaults status and isDeleted", async () => {
        const faq = await faqModel_1.FaqModel.create({ question: "Test?", answer: "Testing content" });
        expect(faq.status).toBe("active");
        expect(faq.isDeleted).toBe(false);
    });
});
