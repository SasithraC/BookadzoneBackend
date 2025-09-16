import request from 'supertest';
import app from '../app';

describe('Authentication API', () => {
  const validUser = { email: 'admin@gmail.com', password: 'admin@123' };
  let token: string;

  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send(validUser);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('rejects invalid login', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'wrongpass' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.status).toBe("fail");
  });

  it('refreshes token with valid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects refresh without token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh');
    expect(res.status).toBe(403);
    expect(res.body.status).toBe(false);
  });
});
