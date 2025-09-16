import request from 'supertest'
import app from '../../../app'

describe('AuthenticationController', () => {
  let token = ''

  it('authLogin - valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@gmail.com', password: 'admin@123' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    token = res.body.token
  })

  it('authLogin - invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'wrong@mail.com', password: 'badpass' })
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(['fail', false]).toContain(res.body.status)
  })

  it('refreshToken - valid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('refreshToken - no token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh')
    expect(res.status).toBe(403)
    expect(res.body.status).toBe(false)
  })
})
