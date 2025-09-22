"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faqService_1 = __importDefault(require("../faqService"));
describe('FaqService', () => {
    it('throws if question missing', async () => {
        await expect(faqService_1.default.createFaq({ answer: 'A', status: 'active', isDeleted: false }))
            .rejects.toThrow('question is required');
    });
    it('throws if answer missing', async () => {
        await expect(faqService_1.default.createFaq({ question: 'Q', status: 'active', isDeleted: false }))
            .rejects.toThrow('answer is required');
    });
    it('throws on too long question', async () => {
        await expect(faqService_1.default.createFaq({ question: 'a'.repeat(501), answer: 'ans', status: 'active', isDeleted: false }))
            .rejects.toThrow(/question must not exceed 500/);
    });
    it('throws on invalid status', async () => {
        await expect(faqService_1.default.createFaq({ question: 'test', answer: 'ans', status: 'wrong', isDeleted: false }))
            .rejects.toThrow(/status must be one of/);
    });
});
