import mongoose from 'mongoose'
import { FaqModel } from '../faqModel'
import { ENV } from '../../config/env'

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('FaqModel', () => {
  it('requires question and answer', async () => {
    const faq = new FaqModel({})
    let error
    try {
      await faq.save()
    } catch (e) { error = e }
    expect(error).toBeDefined()
    if (error && typeof error === 'object' && 'errors' in error) {
      const err = error as { errors: { [key: string]: any } }
      expect(err.errors.question).toBeDefined()
      expect(err.errors.answer).toBeDefined()
    }
  })

  it('defaults status and isDeleted', async () => {
    const faq = await FaqModel.create({ question: 'Test?', answer: 'Testing content' })
    expect(faq.status).toBe('active')
    expect(faq.isDeleted).toBe(false)
  })
})
