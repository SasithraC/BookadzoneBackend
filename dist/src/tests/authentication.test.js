"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Authentication API', () => {
    const validUser = { email: 'admin@gmail.com', password: 'admin@123' };
    let token;
    it('logs in with valid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send(validUser);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });
    it('rejects invalid login', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/login')
            .send({ email: 'nonexistent@example.com', password: 'wrongpass' });
        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(res.body.status).toBe("fail");
    });
    it('refreshes token with valid token', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/refresh')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
    it('rejects refresh without token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/refresh');
        expect(res.status).toBe(403);
        expect(res.body.status).toBe(false);
    });
});
