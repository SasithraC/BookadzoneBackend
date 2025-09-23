import newsLetterService from '../newsLetterService'

describe('newsLetterService', () => {
  it('throws if name missing', async () => {
    await expect(newsLetterService.createNewsLetter({ slug: 'A',template:"testing", status: 'active', isDeleted: false } as any))
      .rejects.toThrow('name is required')
  })

it("throws if template missing", async () => {
  await expect(
    newsLetterService.createNewsLetter({ name: "Q", slug: "Q", status: "active", isDeleted: false } as any)
  ).rejects.toThrow(/Path `template` is required/);
});


  it('throws on too long name', async () => {
    await expect(newsLetterService.createNewsLetter({ name: 'a'.repeat(501), slug: 'a',template:"testing", status: 'active', isDeleted: false } as any))
      .rejects.toThrow(/name must not exceed 500/)
  })

  it('throws on invalid status', async () => {
    await expect(newsLetterService.createNewsLetter({ name: 'test', slug: 'test',template:"testing", status: 'wrong', isDeleted: false } as any))
      .rejects.toThrow(/status must be one of/)
  })
})
