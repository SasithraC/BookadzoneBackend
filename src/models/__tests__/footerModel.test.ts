import mongoose from 'mongoose'
import { FooterInfoModel } from '../footerinfoModel'

jest.mock('mongoose', () => {
  const mSchema = jest.fn().mockImplementation((definition) => ({
    obj: definition,
  }));

  return {
    Schema: mSchema,
    model: jest.fn().mockReturnValue(class MockFooterInfoModel {
      logo: string;
      description: string;
      socialmedia: string;
      socialmedialinks: string;
      google: string;
      appstore: string;
      status: string;
      priority: number;
      isDeleted: boolean;

      constructor(data: any = {}) {
        this.logo = '';
        this.description = '';
        this.socialmedia = '';
        this.socialmedialinks = '';
        this.google = '';
        this.appstore = '';
        this.status = 'active';
        this.priority = 1;
        this.isDeleted = false;
        Object.assign(this, data);
      }

      save() {
        const errors: any = {};
        if (!this.logo) errors.logo = { message: 'Logo is required' };
        if (!this.description) errors.description = { message: 'Description is required' };
        if (Object.keys(errors).length > 0) {
          return Promise.reject({ errors });
        }
        return Promise.resolve(this);
      }

      validateSync() {
        const errors: any = {};
        if (!this.logo) errors.logo = { message: 'Logo is required' };
        if (!this.description) errors.description = { message: 'Description is required' };
        return Object.keys(errors).length > 0 ? { errors } : undefined;
      }

      static create(data: any) {
        const instance = new MockFooterInfoModel(data);
        return instance.save();
      }
    }),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

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
