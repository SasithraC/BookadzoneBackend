import footerService from '../footerInfo'

describe('FooterService', () => {
  it('throws if logo missing', async () => {
    await expect(
      footerService.createFooterInfo({
        description: 'Some description',
        priority: 1,
        status: 'active',
        isDeleted: false,
      } as any)
    ).rejects.toThrow('logo is required')
  })

  it('throws if description missing', async () => {
    const uniqueLogo = `logo-${Date.now()}-desc.png`
    await expect(
      footerService.createFooterInfo({
        logo: uniqueLogo,
        priority: 1,
        status: 'active',
        isDeleted: false,
      } as any)
    ).rejects.toThrow('description is required')
  })



  it('throws on invalid status', async () => {
    const uniqueLogo = `logo-${Date.now()}-status.png`
    await expect(
      footerService.createFooterInfo({
        logo: uniqueLogo,
        description: 'Some description',
        priority: 2,
        status: 'wrong',
        isDeleted: false,
      } as any)
    ).rejects.toThrow(/status must be one of/)
  })

  it('creates successfully with valid data', async () => {
    const uniqueLogo = `logo-${Date.now()}-valid.png`  // 👈 always unique
    const data = {
      logo: uniqueLogo,
      description: 'Valid description',
      socialmedia: 'facebook',
      socialmedialinks: 'https://fb.com',
      google: 'https://google.com',
      appstore: 'https://appstore.com',
      priority: 5,
      status: 'active',
      isDeleted: false,
    }

    const result = await footerService.createFooterInfo(data as any)

    expect(result).toHaveProperty('logo', uniqueLogo)
    expect(result).toHaveProperty('description', 'Valid description')
    expect(result).toHaveProperty('priority', 5)
    expect(['active', 'inactive']).toContain(result.status)
  })
})
