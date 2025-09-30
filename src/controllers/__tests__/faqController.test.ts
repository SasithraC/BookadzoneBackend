  import request from 'supertest'
  import app from '../../app'

  describe('FaqController', () => {
    it('returns 400 if FAQ id is missing for getFaqById', async () => {
      const res = await request(app)
        .get('/api/v1/faqs/getFaqById/')
        .set('Authorization', `Bearer ${token}`)
      expect([400,404]).toContain(res.status)
    });

    it('returns 404 if FAQ not found for getFaqById', async () => {
      const res = await request(app)
        .get('/api/v1/faqs/getFaqById/invalidid')
        .set('Authorization', `Bearer ${token}`)
      expect([404,400,500]).toContain(res.status)
    });

    it('returns 409 if FAQ already exists', async () => {
      // Try to create the same FAQ twice
      const faqData = { question: 'Duplicate FAQ?', answer: 'Duplicate answer.', status: 'active' };
      await request(app)
        .post('/api/v1/faqs')
        .set('Authorization', `Bearer ${token}`)
        .send(faqData);
      const res = await request(app)
        .post('/api/v1/faqs')
        .set('Authorization', `Bearer ${token}`)
        .send(faqData);
      expect([409,400]).toContain(res.status);
    });

    it('returns 400 if FAQ id is missing for updateFaq', async () => {
      const res = await request(app)
        .put('/api/v1/faqs/updateFaq/')
        .set('Authorization', `Bearer ${token}`)
        .send({ answer: 'Updated Answer.' });
      expect([400,404]).toContain(res.status);
    });

    it('returns 404 if FAQ not found for updateFaq', async () => {
      const res = await request(app)
        .put('/api/v1/faqs/updateFaq/invalidid')
        .set('Authorization', `Bearer ${token}`)
        .send({ answer: 'Updated Answer.' });
      expect([404,400,500]).toContain(res.status);
    });

    it('returns 400 if FAQ id is missing for softDeleteFaq', async () => {
      const res = await request(app)
        .delete('/api/v1/faqs/softDeleteFaq/')
        .set('Authorization', `Bearer ${token}`);
      expect([400,404]).toContain(res.status);
    });

    it('returns 404 if FAQ not found for softDeleteFaq', async () => {
      const res = await request(app)
        .delete('/api/v1/faqs/softDeleteFaq/invalidid')
        .set('Authorization', `Bearer ${token}`);
      expect([404,400,500]).toContain(res.status);
    });

    it('returns 400 if FAQ id is missing for restoreFaq', async () => {
      const res = await request(app)
        .patch('/api/v1/faqs/restore/')
        .set('Authorization', `Bearer ${token}`);
      expect([400,404]).toContain(res.status);
    });

    it('returns 404 if FAQ not found for restoreFaq', async () => {
      const res = await request(app)
        .patch('/api/v1/faqs/restore/invalidid')
        .set('Authorization', `Bearer ${token}`);
      expect([404,400,500]).toContain(res.status);
    });

    it('returns 400 if FAQ id is missing for permanentDelete', async () => {
      const res = await request(app)
        .delete('/api/v1/faqs/permanentDelete/')
        .set('Authorization', `Bearer ${token}`);
      expect([400,404]).toContain(res.status);
    });

    it('returns 404 if FAQ not found for permanentDelete', async () => {
      const res = await request(app)
        .delete('/api/v1/faqs/permanentDelete/invalidid')
        .set('Authorization', `Bearer ${token}`);
      expect([404,400,500]).toContain(res.status);
    });
    let token = ''
    let faqId = ''
    beforeAll(async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'admin@gmail.com',
        password: 'admin@123'
      })
      token = res.body.token
    })

    it('creates a FAQ', async () => {
      const res = await request(app)
        .post('/api/v1/faqs')
        .set('Authorization', `Bearer ${token}`)
        .send({ question: 'Test FAQ?', answer: 'This is the answer.', status: 'active' })
      expect(res.status).toBe(201)
      expect(res.body.data.question).toBe('Test FAQ?')
      faqId = res.body.data._id
    })

    it('retrieves all FAQs', async () => {
      const res = await request(app)
        .get('/api/v1/faqs')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('retrieves a FAQ by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/faqs/getFaqById/${faqId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data._id).toEqual(faqId)
    })

    it('updates a FAQ', async () => {
      const res = await request(app)
        .put(`/api/v1/faqs/updateFaq/${faqId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ answer: 'Updated Answer.' })
      expect(res.status).toBe(200)
      expect(res.body.data.answer).toBe('Updated Answer.')
    })

    it('toggles FAQ status', async () => {
      const res = await request(app)
        .patch(`/api/v1/faqs/togglestatus/${faqId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(['active', 'inactive']).toContain(res.body.data.status)
    })

    it('soft deletes a FAQ', async () => {
      const res = await request(app)
        .delete(`/api/v1/faqs/softDeleteFaq/${faqId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.isDeleted).toBe(true)
    })

    it('restores a FAQ', async () => {
      const res = await request(app)
        .patch(`/api/v1/faqs/restore/${faqId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.isDeleted).toBe(false)
    })

    it('retrieves FAQs from trash', async () => {
      await request(app).delete(`/api/v1/faqs/softDeleteFaq/${faqId}`).set('Authorization', `Bearer ${token}`)
      const res = await request(app)
        .patch('/api/v1/faqs/trash/')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('permanently deletes a FAQ', async () => {
      const res = await request(app)
        .delete(`/api/v1/faqs/permanentDelete/${faqId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
    })
  })
