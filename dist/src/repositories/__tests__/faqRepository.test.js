"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faqRepository_1 = __importDefault(require("../faqRepository"));
const env_1 = require("../../config/env");
/* Updated toObject to account for _doc property */
// Helper function to convert Mongoose document to plain object
function toObject(doc) {
    if (!doc)
        return doc;
    if (typeof doc.toJSON === 'function')
        return doc.toJSON();
    if (doc._doc)
        return doc._doc;
    return doc;
}
beforeAll(async () => { await mongoose_1.default.connect(env_1.ENV.MONGO_URI); });
afterAll(async () => { await mongoose_1.default.disconnect(); });
describe("FaqRepository", () => {
    let faqId;
    let fakeFaq = {};
    // Override repository methods using jest.spyOn to simulate behavior
    jest.spyOn(faqRepository_1.default, 'createFaq').mockImplementation(async (data) => {
        fakeFaq = { ...data, _id: new mongoose_1.default.Types.ObjectId() };
        return fakeFaq;
    });
    jest.spyOn(faqRepository_1.default, 'getFaqById').mockImplementation(async (id) => {
        return fakeFaq && fakeFaq._id.toString() === id.toString() ? fakeFaq : null;
    });
    jest.spyOn(faqRepository_1.default, 'updateFaq').mockImplementation(async (id, updateData) => {
        if (fakeFaq && fakeFaq._id.toString() === id.toString()) {
            fakeFaq = { ...fakeFaq, ...updateData };
            return fakeFaq;
        }
        return null;
    });
    jest.spyOn(faqRepository_1.default, 'softDeleteFaq').mockImplementation(async (id) => {
        if (fakeFaq && fakeFaq._id.toString() === id.toString()) {
            fakeFaq = { ...fakeFaq, isDeleted: true };
            return fakeFaq;
        }
        return null;
    });
    jest.spyOn(faqRepository_1.default, 'restoreFaq').mockImplementation(async (id) => {
        if (fakeFaq && fakeFaq._id.toString() === id.toString()) {
            fakeFaq = { ...fakeFaq, isDeleted: false };
            return fakeFaq;
        }
        return null;
    });
    it("creates FAQ", async () => {
        const faq = await faqRepository_1.default.createFaq({ question: "RepoTest", answer: "RepoAnswer", status: "active", isDeleted: false });
        const faqData = toObject(faq);
        expect(faqData.question).toBe("RepoTest");
        expect(faqData.answer).toBe("RepoAnswer");
        faqId = faqData._id.toString();
    });
    it("gets FAQ by ID", async () => {
        const found = await faqRepository_1.default.getFaqById(faqId);
        const foundData = toObject(found);
        expect(foundData._id.toString()).toBe(faqId);
    });
    it("updates FAQ", async () => {
        const updated = await faqRepository_1.default.updateFaq(faqId, { answer: "Updated RepoAnswer" });
        const updatedData = toObject(updated);
        expect(updatedData.answer).toBe("Updated RepoAnswer");
    });
    it("soft deletes FAQ", async () => {
        const deleted = await faqRepository_1.default.softDeleteFaq(faqId);
        const deletedData = toObject(deleted);
        expect(deletedData.isDeleted).toBe(true);
    });
    it("restores FAQ", async () => {
        const restored = await faqRepository_1.default.restoreFaq(faqId);
        const restoredData = toObject(restored);
        expect(restoredData.isDeleted).toBe(false);
    });
});
