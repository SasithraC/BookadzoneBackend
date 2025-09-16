import faqService from '../faqService'

describe('FaqService', () => {
  it('throws if question missing', async () => {
    await expect(faqService.createFaq({ answer: 'A', status: 'active', isDeleted: false } as any))
      .rejects.toThrow('question is required')
  })

  it('throws if answer missing', async () => {
    await expect(faqService.createFaq({ question: 'Q', status: 'active', isDeleted: false } as any))
      .rejects.toThrow('answer is required')
  })

  it('throws on too long question', async () => {
    await expect(faqService.createFaq({ question: 'a'.repeat(501), answer: 'ans', status: 'active', isDeleted: false } as any))
      .rejects.toThrow(/question must not exceed 500/)
  })

  it('throws on invalid status', async () => {
    await expect(faqService.createFaq({ question: 'test', answer: 'ans', status: 'wrong', isDeleted: false } as any))
      .rejects.toThrow(/status must be one of/)
  })
})
