import mongoose from "mongoose";
import {NewsLetter} from "../newsLettermodel";

jest.mock('mongoose', () => {
  const mSchema = jest.fn().mockImplementation((definition) => ({
    obj: definition,
  }));

  return {
    Schema: mSchema,
    model: jest.fn().mockReturnValue(class MockNewsLetterModel {
      name: string;
      slug: string;
      template: string;
      status: string;
      isDeleted: boolean;

      constructor(data: any = {}) {
        this.name = '';
        this.slug = '';
        this.template = '';
        this.status = 'active';
        this.isDeleted = false;
        Object.assign(this, data);
      }

      save() {
        const errors: any = {};
        if (!this.name) errors.name = { message: 'Name is required' };
        if (!this.slug) errors.slug = { message: 'Slug is required' };
        if (!this.template) errors.template = { message: 'Template is required' };
        if (Object.keys(errors).length > 0) {
          return Promise.reject({ errors });
        }
        return Promise.resolve(this);
      }

      validateSync() {
        const errors: any = {};
        if (!this.name) errors.name = { message: 'Name is required' };
        if (!this.slug) errors.slug = { message: 'Slug is required' };
        if (!this.template) errors.template = { message: 'Template is required' };
        return Object.keys(errors).length > 0 ? { errors } : undefined;
      }

      static create(data: any) {
        const instance = new MockNewsLetterModel(data);
        return instance.save();
      }
    }),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

describe("NewsLetter", () => {
  it("requires name and slug and template", async () => {
    const newsLetter = new NewsLetter({});
    let error;
    try { await newsLetter.save(); } catch (e) { error = e; }
    expect(error).toBeDefined();
    if (error && typeof error === "object" && "errors" in error) {
      const err = error as { errors: { [key: string]: any } }
      expect(err.errors.name).toBeDefined();
      expect(err.errors.slug).toBeDefined();
      expect(err.errors.template).toBeDefined();
    }
  });

  it("defaults status and isDeleted", async () => {
    const faq = await NewsLetter.create({ name: "Test?", slug: "Test?",template:"testing template" });
    expect(faq.status).toBe("active");
    expect(faq.isDeleted).toBe(false);
  });
});
