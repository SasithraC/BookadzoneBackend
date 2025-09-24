"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationHelper_1 = __importDefault(require("../validationHelper"));
describe('ValidationHelper', () => {
    it('validates required', () => {
        expect(validationHelper_1.default.isRequired('', 'question')).toEqual({ field: 'question', message: 'question is required' });
        expect(validationHelper_1.default.isRequired('test', 'question')).toBeNull();
    });
    it('validates boolean', () => {
        expect(validationHelper_1.default.isBoolean(true, 'isDeleted')).toBeNull();
        expect(validationHelper_1.default.isBoolean('no', 'isDeleted')).toEqual({ field: 'isDeleted', message: 'isDeleted must be a boolean' });
    });
    it('validates email', () => {
        expect(validationHelper_1.default.isValidEmail('not-an-email', 'email')).toEqual({ field: 'email', message: 'email must be a valid email address' });
        expect(validationHelper_1.default.isValidEmail('valid@example.com', 'email')).toBeNull();
    });
    it('validates enum', () => {
        expect(validationHelper_1.default.isValidEnum('wrong', 'status', ['active', 'inactive'])).toEqual({ field: 'status', message: 'status must be one of: active, inactive' });
        expect(validationHelper_1.default.isValidEnum('active', 'status', ['active', 'inactive'])).toBeNull();
    });
});
