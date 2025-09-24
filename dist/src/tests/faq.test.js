"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('FAQ API', () => {
    let token = '';
    let faqId = '';
    beforeAll(async () => {
        const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send({
            email: 'admin@gmail.com',
            password: 'admin@123',
        });
        token = loginRes.body.token;
    });
    it('creates a FAQ', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/faqs')
            .set('Authorization', `Bearer ${token}`)
            .send({
            question: 'What is Avenstek?',
            answer: 'A tech company.',
            status: 'active'
        });
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('question', 'What is Avenstek?');
        faqId = res.body.data._id;
    });
    it('retrieves all FAQs', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/v1/faqs')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('retrieves the FAQ by ID', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/v1/faqs/getFaqById/${faqId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data._id.toString()).toEqual(faqId.toString());
    });
    it('updates the FAQ', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/v1/faqs/updateFaq/${faqId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ answer: 'An advanced tech company.' });
        expect(res.status).toBe(200);
        expect(res.body.data.answer).toBe('An advanced tech company.');
    });
    it('toggles FAQ status', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/api/v1/faqs/togglestatus/${faqId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(['active', 'inactive']).toContain(res.body.data.status);
    });
    it('soft deletes the FAQ', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/faqs/softDeleteFaq/${faqId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.isDeleted).toBe(true);
    });
    it('restores the soft deleted FAQ', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/api/v1/faqs/restore/${faqId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.isDeleted).toBe(false);
    });
    it('retrieves FAQs in trash', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch('/api/v1/faqs/trash')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('deletes FAQ permanently', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/faqs/permanentDelete/${faqId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});
