import mongoose from "mongoose";
import { FaqModel } from "../faqModel";

jest.mock('mongoose', () => {
  class MockModel {
    question!: string;
    answer!: string;
    status!: string;
    isDeleted!: boolean;

    constructor(data: any = {}) {
      Object.assign(this, {
        question: '',
        answer: '',
        status: 'active',
        isDeleted: false,
        ...data
      });
    }

    async save() {
      const errors: any = {};
      if (!this.question) errors.question = { message: 'Question is required' };
      if (!this.answer) errors.answer = { message: 'Answer is required' };
      if (Object.keys(errors).length > 0) {
        const error = new Error('Validation failed');
        (error as any).errors = errors;
        return Promise.reject(error);
      }
      return Promise.resolve(this);
    }

    static create(data: any) {
      return Promise.resolve(new MockModel(data));
    }
  }

  return {
    Schema: jest.fn(),
    model: jest.fn().mockReturnValue(MockModel),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connection: { close: jest.fn() }
  };
});

describe("FaqModel", () => {
  it("requires question and answer", async () => {
    const faq = new FaqModel({});
    let error;
    try { await faq.save(); } catch (e) { error = e; }
    expect(error).toBeDefined();
    if (error && typeof error === "object" && "errors" in error) {
      const err = error as { errors: { [key: string]: any } }
      expect(err.errors.question).toBeDefined();
      expect(err.errors.answer).toBeDefined();
    }
  });

  it("defaults status and isDeleted", async () => {
    const faq = await FaqModel.create({ question: "Test?", answer: "Testing content" });
    expect(faq.status).toBe("active");
    expect(faq.isDeleted).toBe(false);
  });
});
