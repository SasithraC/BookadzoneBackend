import mongoose from 'mongoose'
import faqRepository from '../faqRepository'
import { ENV } from '../../config/env'

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('FaqRepository', () => {
  let faqId: string = ''
  it('createFaq creates FAQ', async () => {
    const faq = await faqRepository.createFaq({ question: 'RepoTest', answer: 'RepoAnswer', status: 'active', isDeleted: false } as any)
    expect(faq.question).toBe('RepoTest')
    expect(faq.answer).toBe('RepoAnswer')
    // @ts-ignore
    faqId = (faq._id as any).toString()
  })

  it('getFaqById finds FAQ', async () => {
    const found = await faqRepository.getFaqById(faqId)
    expect(found && (found._id as any).toString()).toBe(faqId)
  })

  it('updateFaq updates FAQ', async () => {
    const updated = await faqRepository.updateFaq(faqId, { answer: 'Updated RepoAnswer' })
  expect(updated?.answer).toBe('Updated RepoAnswer')
  })

  it('softDeleteFaq marks FAQ as deleted', async () => {
    const deleted = await faqRepository.softDeleteFaq(faqId)
  expect(deleted?.isDeleted).toBe(true)
  })

  it('restoreFaq recovers FAQ', async () => {
    const restored = await faqRepository.restoreFaq(faqId)
  expect(restored?.isDeleted).toBe(false)
  })

  it('deleteFaqPermanently removes FAQ', async () => {
    const del = await faqRepository.deleteFaqPermanently(faqId)
    expect(del).not.toBeNull()
  })
})
