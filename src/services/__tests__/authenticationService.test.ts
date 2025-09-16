import authenticationService from '../authenticationService'

describe('AuthenticationService', () => {
  it('throws if email is missing', async () => {
    await expect(authenticationService.authLogin({ email: '', password: 'pass' }))
      .rejects.toThrow('email is required')
  })

  it('throws if password is missing', async () => {
    await expect(authenticationService.authLogin({ email: 'mail@mail.com', password: '' }))
      .rejects.toThrow('password is required')
  })

  it('throws if password too short', async () => {
    await expect(authenticationService.authLogin({ email: 'mail@mail.com', password: '123' }))
      .rejects.toThrow(/must be at least 6 characters/)
  })
})
