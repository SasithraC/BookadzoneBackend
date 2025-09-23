import request from 'supertest'
import app from '../../app'

describe('NewsLetterController', () => {
  let token = ''
  let newsLetterId = ''
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@gmail.com',
      password: 'admin@123'
    })
    token = res.body.token
  })

  it('creates a NewsLetter', async () => {
    const res = await request(app)
      .post('/api/v1/newsletters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test NewsLetter?', slug: 'Test NewsLetter?',template:'This is the answer.', status: 'active' })
    expect(res.status).toBe(201)
    expect(res.body.data.name).toBe('Test NewsLetter?')
    newsLetterId = res.body.data._id
  })

  it('retrieves all NewsLetters', async () => {
    const res = await request(app)
      .get('/api/v1/newsletters')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
it("should return 409 if newsletter already exists", async () => {
  // 1. First create newsletter
  await request(app)
    .post("/api/v1/newsletters")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "My Newsletter",
      slug: "my-newsletter",
      template: "<p>Hi</p>",
      status: "active",
    });

  // 2. Try to create same newsletter again
  const res = await request(app)
    .post("/api/v1/newsletters")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "My Newsletter",
      slug: "my-newsletter", // duplicate slug/name
      template: "<p>Hi</p>",
      status: "active",
    });

  // 3. Assert response
  expect(res.status).toBe(409);
  expect(res.body.status).toBe("fail"); // HTTP_RESPONSE.FAIL
  expect(res.body.message).toMatch(/already exists/);
});

  it('retrieves a NewsLetter by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/newsletters/getNewsLetterById/${newsLetterId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data._id).toEqual(newsLetterId)
  })

  it('updates a NewsLetter', async () => {
    const res = await request(app)
      .put(`/api/v1/newsletters/updateNewsLetter/${newsLetterId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ template: 'Updated template.' })
    expect(res.status).toBe(200)
    expect(res.body.data.template).toBe('Updated template.')
  })

  it('toggles NewsLetter status', async () => {
    const res = await request(app)
      .patch(`/api/v1/newsletters/togglestatus/${newsLetterId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(['active', 'inactive']).toContain(res.body.data.status)
  })

  it('soft deletes a NewsLetter', async () => {
    const res = await request(app)
      .delete(`/api/v1/newsletters/softDeleteNewsLetter/${newsLetterId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.isDeleted).toBe(true)
  })

  it('restores a NewsLetter', async () => {
    const res = await request(app)
      .patch(`/api/v1/newsletters/restore/${newsLetterId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.isDeleted).toBe(false)
  })
  it("should get all trash newsletters", async () => {
  await request(app)
    .delete(`/api/v1/newsletters/softDeleteNewsLetter/${newsLetterId}`)
    .set("Authorization", `Bearer ${token}`);
  const res = await request(app)
    .get("/api/v1/newsletters/trash")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
});


  it('permanently deletes a NewsLetter', async () => {
    const res = await request(app)
      .delete(`/api/v1/newsletters/permanentDelete/${newsLetterId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })
})
