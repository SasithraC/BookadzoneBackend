import pageService from '../pageService';

describe('pageService', () => {
  it('throws if title missing', async () => {
    await expect(
      pageService.createPage({
        name: 'A',
        slug: 'A',
        type: 'template',
        status: 'active',
        isDeleted: false
      } as any)
    ).rejects.toThrow('title is required');
  });

  it('throws if name missing', async () => {
    await expect(
      pageService.createPage({
        title: 'Test',
        slug: 'A',
        type: 'template',
        status: 'active',
        isDeleted: false
      } as any)
    ).rejects.toThrow('name is required');
  });

  it('throws if type missing', async () => {
    await expect(
      pageService.createPage({
        title: 'Test',
        name: 'A',
        slug: 'A',
        status: 'active',
        isDeleted: false
      } as any)
    ).rejects.toThrow('type is required');
  });

  it('throws on too long name', async () => {
    await expect(
      pageService.createPage({
        title: 'Test',
        name: 'a'.repeat(501),
        slug: 'A',
        type: 'template',
        status: 'active',
        isDeleted: false
      } as any)
    ).rejects.toThrow(/name must not exceed 500/);
  });

  it('throws on invalid status', async () => {
    await expect(
      pageService.createPage({
        title: 'Test',
        name: 'test',
        slug: 'test',
        type: 'template',
        status: 'wrong',
        isDeleted: false
      } as any)
    ).rejects.toThrow(/status must be one of/);
  });
});