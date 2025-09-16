import mongoose from 'mongoose'
import { CommonRepository } from '../common.repository'
import { FaqModel } from '../../models/faqModel'
import { ENV } from '../../config/env'

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

const repo = new CommonRepository(FaqModel)

describe('CommonRepository', () => {
  it('existsByField returns false if none', async () => {
    const exists = await repo.existsByField('question', 'no_such_question')
    expect(exists).toBe(false)
  })

  it('toggleStatus toggles status', async () => {
    const faq = await FaqModel.create({ question: 'Toggle?', answer: 'Toggle answer' })
  const toggled = await repo.toggleStatus((faq._id instanceof mongoose.Types.ObjectId ? faq._id.toString() : String(faq._id)))
  expect(toggled).not.toBeNull()
  expect(['active', 'inactive']).toContain(toggled!.status)
  })

  it('getStats returns counts', async () => {
    const stats = await repo.getStats()
    expect(stats).toHaveProperty('total')
    expect(stats).toHaveProperty('active')
    expect(stats).toHaveProperty('inactive')
  })
})
