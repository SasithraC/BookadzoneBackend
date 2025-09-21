"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
describe('FooterInfoController', () => {
    let token = '';
    let footerinfoId = '';
    beforeAll(async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send({
            email: 'admin@gmail.com',
            password: 'admin@123'
        });
        token = res.body.token;
    });
    it('creates a FooterInfo', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/footerinfo')
            .set('Authorization', `Bearer ${token}`)
            .send({
            logo: 'unique-controller-logo.png', // 👈 ensure uniqueness
            description: 'This is footer description.',
            socialmedia: 'Facebook',
            socialmedialinks: 'https://facebook.com/test',
            google: 'https://play.google.com/app/test',
            appstore: 'https://appstore.com/test',
            status: 'active',
            priority: 1
        });
        expect(res.status).toBe(201);
        expect(res.body.data.logo).toBe('unique-controller-logo.png');
        expect(res.body.data.description).toBe('This is footer description.');
        footerinfoId = res.body.data._id;
    });
    it('retrieves all Footerinfo', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/v1/footerinfo')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const items = res.body.data?.data || [];
        expect(Array.isArray(items)).toBe(true);
        expect(items.some((f) => f._id === footerinfoId)).toBe(true);
    });
    it('updates a FooterInfo', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/v1/footerinfo/updatefooterinfo/${footerinfoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Updated footer description.' });
        expect(res.status).toBe(200);
        expect(res.body.data.description).toBe('Updated footer description.');
    });
    it('toggles FooterInfo status', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/api/v1/footerinfo/togglestatus/${footerinfoId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(['active', 'inactive']).toContain(res.body.data.status);
    });
    it('soft deletes a FooterInfo', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/footerinfo/softDeletefooterinfo/${footerinfoId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.isDeleted).toBe(true);
    });
    it('restores a FooterInfo', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/api/v1/footerinfo/restore/${footerinfoId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.isDeleted).toBe(false);
    });
    it('retrieves footerinfo from trash', async () => {
        await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/footerinfo/softDeletefooterinfo/${footerinfoId}`)
            .set('Authorization', `Bearer ${token}`);
        const res = await (0, supertest_1.default)(app_1.default)
            .patch('/api/v1/footerinfo/trash')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('permanently deletes a FooterInfo', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/footerinfo/permanentDelete/${footerinfoId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});
