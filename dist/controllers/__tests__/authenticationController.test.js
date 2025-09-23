"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
// If you get a module not found error, ensure you run tests from the project root (BookadzoneBackend)
// and that app.ts is at the root. Adjust the path if your structure is different.
const app_1 = __importDefault(require("../../../app"));
describe('AuthenticationController', () => {
    let token = '';
    it('authLogin - valid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({ email: 'admin@gmail.com', password: 'admin@123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });
    it('authLogin - invalid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({ email: 'wrong@mail.com', password: 'badpass' });
        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(['fail', false]).toContain(res.body.status);
    });
    it('refreshToken - valid token', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/refresh')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
    it('refreshToken - no token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/refresh');
        expect(res.status).toBe(403);
        expect(res.body.status).toBe(false);
    });
});
