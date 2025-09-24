import mongoose from 'mongoose'
import { FooterInfoModel } from '../footerinfoModel'
import { ENV } from '../../config/env'

beforeAll(async () => {
  await mongoose.connect(ENV.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('FooterInfoModel', () => {
  it('requires logo and description', async () => {
    const footer = new FooterInfoModel({})
    let error
    try {
      await footer.save()
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    if (error && typeof error === 'object' && 'errors' in error) {
      const err = error as { errors: { [key: string]: any } }
      expect(err.errors.logo).toBeDefined()
      expect(err.errors.description).toBeDefined()
    }
  })

  it('defaults status, isDeleted and priority', async () => {
    const footer = await FooterInfoModel.create({
      logo: 'logo.png',
      description: 'Footer description'
    })

    expect(footer.status).toBe('active')
    expect(footer.isDeleted).toBe(false)
    expect(footer.priority).toBe(1)
  })

  it('allows optional fields to be empty', async () => {
    const footer = await FooterInfoModel.create({
      logo: 'logo.png',
      description: 'Footer description'
    })

    expect(footer.socialmedia).toBe('')
    expect(footer.socialmedialinks).toBe('')
    expect(footer.google).toBe('')
    expect(footer.appstore).toBe('')
  })
})
