import mongoose from 'mongoose'
import User from '../userModel'
import { ENV } from '../../config/env'
beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('UserModel', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  it('requires email and password', async () => {
    const user = new User({})
    let error
    try {
      await user.save()
    } catch (e) { error = e }
    expect(error).toBeDefined()
    if (error && typeof error === 'object' && 'errors' in error) {
      const err = error as { errors: { [key: string]: any } }
      expect(err.errors.email).toBeDefined()
      expect(err.errors.password).toBeDefined()
    }
  })

  it('defaults role, status, isDeleted', async () => {
    const user = await User.create({ email: 'test@test.com', password: 'admin@123' })
    expect(user.role).toBe('super-admin')
    expect(user.status).toBe('active')
    expect(user.isDeleted).toBe(false)
  })
})
