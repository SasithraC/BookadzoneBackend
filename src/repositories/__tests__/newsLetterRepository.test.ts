// Mock mongoose first
jest.mock('mongoose', () => {
  class ObjectId {
    constructor(private readonly id: string) {}
    toString() { return this.id; }
  }

  const Schema = function() { return { Types: { ObjectId } }; };
  Schema.Types = { ObjectId };
  
  return {
    Schema,
    model: () => ({}),
    Types: { ObjectId },
  };
});

import newsLetterRepository from "../newsLetterRepository";
import { NewsLetter, ILetter } from "../../models/newsLettermodel";

// Create a base mock object with Document methods
const createMockDocument = (data: any) => ({
  ...data,
  $assertPopulated: jest.fn(),
  $clearModifiedPaths: jest.fn(),
  $clone: jest.fn(),
  $createModifiedPathsSnapshot: jest.fn(),
  save: jest.fn(),
  isNew: false,
  errors: undefined,
  schema: {},
  toObject: jest.fn(() => data),
  toJSON: jest.fn(() => data),
});

// Mock the NewsLetter model
jest.mock("../../models/newsLettermodel", () => ({
  NewsLetter: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  }
}));

describe("NewsLetterRepository", () => {
  let newsLetterId: string;
  const mockData = createMockDocument({
    _id: "mock-id",
    name: "RepoTest",
    slug: "repotest",
    template: "testing",
    status: "active",
    isDeleted: false,
    id: "mock-id",
  }) as unknown as ILetter;

  beforeEach(() => {
    jest.clearAllMocks();
    newsLetterId = (mockData._id as string).toString();
  });

  it("creates FAQ", async () => {
    (NewsLetter.create as jest.Mock).mockResolvedValue(mockData);
    const newsLetter = await newsLetterRepository.createNewsLetter(mockData);
    expect(newsLetter.name).toBe("RepoTest");
    expect(newsLetter.slug).toBe("repotest");
  });

  it("gets NewsLetter by ID", async () => {
    (NewsLetter.findById as jest.Mock).mockResolvedValue(mockData);
    const found = await newsLetterRepository.getNewsLetterById(newsLetterId);
    expect(found?._id).toBe(newsLetterId);
  });

  it("updates NewsLetter", async () => {
    const updatedData = { ...mockData, name: "Updated RepoName" };
    (NewsLetter.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedData);
    
    const updated = await newsLetterRepository.updateNewsLetter(newsLetterId, { name: "Updated RepoName" });
    expect(updated?.name).toBe("Updated RepoName");
  });

  it("soft deletes NewsLetter", async () => {
    const deletedData = { ...mockData, isDeleted: true };
    (NewsLetter.findByIdAndUpdate as jest.Mock).mockResolvedValue(deletedData);
    
    const deleted = await newsLetterRepository.softDeleteNewsLetter(newsLetterId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it("restores NewsLetter", async () => {
    const restoredData = { ...mockData, isDeleted: false, status: "active" };
    (NewsLetter.findByIdAndUpdate as jest.Mock).mockResolvedValue(restoredData);
    
    const restored = await newsLetterRepository.restoreNewsLetter(newsLetterId);
    expect(restored?.isDeleted).toBe(false);
  });
});
