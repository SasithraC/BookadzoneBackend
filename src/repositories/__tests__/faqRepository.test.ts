import { Types } from "mongoose";
import faqRepository from "../faqRepository";
import { FaqModel } from "../../models/faqModel";

// Mock FaqModel
jest.mock("../../models/faqModel", () => ({
  FaqModel: {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  }
}));

// Mock mongoose Types.ObjectId
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn().mockReturnValue(true)
    }
  }
}));

describe("FaqRepository", () => {
  let faqId: string;
  const mockFaq = {
    _id: "mockId",
    question: "RepoTest",
    answer: "RepoAnswer",
    status: "active",
    isDeleted: false,
    toObject: function() { return this; }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates FAQ", async () => {
    const mockFaq = {
      _id: "mockId",
      question: "RepoTest",
      answer: "RepoAnswer",
      status: "active",
      isDeleted: false,
      toObject: function() { return this; }
    };
    (FaqModel.create as jest.Mock).mockResolvedValue(mockFaq);
    
    const faq = await faqRepository.createFaq({ question: "RepoTest", answer: "RepoAnswer" } as any) as typeof mockFaq;
    expect(faq.question).toBe("RepoTest");
    expect(faq.answer).toBe("RepoAnswer");
    faqId = faq._id as string;
  });

  it("gets FAQ by ID", async () => {
    const mockFaq = {
      _id: faqId,
      question: "RepoTest",
      answer: "RepoAnswer",
      toObject: function() { return this; }
    };
    (FaqModel.findById as jest.Mock).mockResolvedValue(mockFaq);
    
    const found = await faqRepository.getFaqById(faqId);
    expect(found).not.toBeNull();
    expect(found!._id).toBe(faqId);
  });

  it("updates FAQ", async () => {
    const mockUpdatedFaq = {
      _id: faqId,
      question: "RepoTest",
      answer: "Updated RepoAnswer",
      toObject: function() { return this; }
    };
    (FaqModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedFaq);
    
    const updated = await faqRepository.updateFaq(faqId, { answer: "Updated RepoAnswer" } as any);
    expect(updated).not.toBeNull();
    expect(updated!.answer).toBe("Updated RepoAnswer");
  });

  it("soft deletes FAQ", async () => {
    const mockDeletedFaq = {
      _id: faqId,
      isDeleted: true,
      toObject: function() { return this; }
    };
    (FaqModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockDeletedFaq);
    
    const deleted = await faqRepository.softDeleteFaq(faqId);
    expect(deleted).not.toBeNull();
    expect(deleted!.isDeleted).toBe(true);
  });

  it("restores FAQ", async () => {
    const mockRestoredFaq = {
      _id: faqId,
      isDeleted: false,
      toObject: function() { return this; }
    };
    (FaqModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockRestoredFaq);
    
    const restored = await faqRepository.restoreFaq(faqId);
    expect(restored).not.toBeNull();
    expect(restored!.isDeleted).toBe(false);
  });
});
