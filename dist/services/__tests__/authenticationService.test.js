"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authenticationService_1 = __importDefault(require("../authenticationService"));
describe('AuthenticationService', () => {
    it('throws if email is missing', async () => {
        await expect(authenticationService_1.default.authLogin({ email: '', password: 'pass' }))
            .rejects.toThrow('email is required');
    });
    it('throws if password is missing', async () => {
        await expect(authenticationService_1.default.authLogin({ email: 'mail@mail.com', password: '' }))
            .rejects.toThrow('password is required');
    });
    it('throws if password too short', async () => {
        await expect(authenticationService_1.default.authLogin({ email: 'mail@mail.com', password: '123' }))
            .rejects.toThrow(/must be at least 6 characters/);
    });
});
