import mongoose from "mongoose";
import pageRepository from "../pageRepository";
import { ENV } from "../../config/env";
import { PageModel } from "../../models/pageModel";
import { CommonRepository } from "../commonRepository";

// Mock Mongoose Types
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn().mockReturnValue(true)
    }
  }
}));

// Mock PageModel
jest.mock("../../models/pageModel", () => {
  const mockExec = jest.fn();
  const mockSkip = jest.fn().mockReturnThis();
  const mockLimit = jest.fn().mockReturnThis();
  const mockFind = jest.fn().mockReturnValue({
    skip: mockSkip,
    limit: mockLimit,
    exec: mockExec
  });

  return {
    PageModel: {
      create: jest.fn(),
      find: mockFind,
      findById: jest.fn().mockReturnValue({ exec: mockExec }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: mockExec }),
      findByIdAndDelete: jest.fn().mockReturnValue({ exec: mockExec }),
      countDocuments: jest.fn().mockReturnValue({ exec: mockExec }),
      aggregate: jest.fn()
    }
  };
});

// Mock CommonRepository
jest.mock("../commonRepository", () => {
  return {
    CommonRepository: jest.fn().mockImplementation(() => ({
      getStats: jest.fn().mockResolvedValue({ total: 1, active: 1, inactive: 0 }),
      toggleStatus: jest.fn().mockImplementation((id) => {
        return Promise.resolve({ _id: id, status: "inactive" });
      })
    }))
  };
});

describe("PageRepository", () => {
  let pageId: string;
  const defaultMockPage = {
    _id: "test-id",
    id: "test-id",
    title: "Test Page",
    name: "Test Name",
    status: "active",
    isDeleted: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    pageId = "test-id";
    (PageModel.create as jest.Mock).mockImplementation(data => ({
      ...defaultMockPage,
      ...data
    }));
    const mockExec = jest.fn().mockResolvedValue(defaultMockPage);
    (PageModel.findById as jest.Mock).mockImplementation(() => ({
      exec: mockExec
    }));
    (PageModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      exec: mockExec
    }));
    (PageModel.findByIdAndDelete as jest.Mock).mockImplementation(() => ({
      exec: mockExec
    }));
    (PageModel.find as jest.Mock).mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: mockExec
    }));
    (PageModel.countDocuments as jest.Mock).mockImplementation(() => ({
      exec: mockExec
    }));
  });

  it("creates Page", async () => {
    const mockPage = {
      _id: pageId,
      id: pageId,
      title: "RepoTest Page",
      name: "RepoTest Name",
      slug: "repotest-slug",
      type: "template",
      status: "active",
      isDeleted: false
    };
    (PageModel.create as jest.Mock).mockResolvedValue(mockPage);
    const page = await pageRepository.createPage({
      title: "RepoTest Page",
      name: "RepoTest Name",
      slug: "repotest-slug",
      type: "template",
      status: "active",
      isDeleted: false
    } as any);
    expect(page.title).toBe("RepoTest Page");
    expect(page.slug).toBe("repotest-slug");
    // @ts-ignore
    pageId = page.id?.toString();
  });

  it("gets Page by ID", async () => {
    const found = await pageRepository.getPageById(pageId);
    expect(found && found.id?.toString()).toBe(pageId);
  });

  it("updates Page", async () => {
    const updatedPage = { ...defaultMockPage, name: "Updated RepoName" };
    const mockExec = jest.fn().mockResolvedValue(updatedPage);
    (PageModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      exec: mockExec
    }));
    const updated = await pageRepository.updatePage(pageId, { name: "Updated RepoName" });
    expect(updated?.name).toBe("Updated RepoName");
  });

  it("soft deletes Page", async () => {
    const deletedPage = { ...defaultMockPage, isDeleted: true };
    const mockExec = jest.fn().mockResolvedValue(deletedPage);
    (PageModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      exec: mockExec
    }));
    const deleted = await pageRepository.softDeletePage(pageId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it("restores Page", async () => {
    const restored = await pageRepository.restorePage(pageId);
    expect(restored?.isDeleted).toBe(false);
  });

  it("toggles status", async () => {
    const mockPage = { ...defaultMockPage, status: "active" };
    const mockToggledPage = { ...mockPage, status: "inactive" };

    // Mock findById for initial check
    (PageModel.findById as jest.Mock).mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockPage)
    }));

    // Mock findByIdAndUpdate for final update
    (PageModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockToggledPage)
    }));

    const toggled = await pageRepository.toggleStatus(pageId);
    expect(toggled?.status).toBe("inactive");
  });

  it("gets all pages", async () => {
    const mockPages = [defaultMockPage];
    const mockFindExec = jest.fn().mockResolvedValue(mockPages);
    const mockCountExec = jest.fn().mockResolvedValue(1);
    const mockStats = { total: 1, active: 1, inactive: 0 };
    
    (PageModel.find as jest.Mock).mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: mockFindExec
    }));
    
    (PageModel.countDocuments as jest.Mock).mockImplementation(() => ({
      exec: mockCountExec
    }));
    
    const result = await pageRepository.getAllPages(1, 10);
    expect(result.data).toEqual(mockPages);
    expect(result.meta.total).toBe(1);
  });

  it("gets all trash pages", async () => {
    const mockFindExec = jest.fn().mockResolvedValue([defaultMockPage]);
    const mockCountExec = jest.fn().mockResolvedValue(1);
    
    (PageModel.find as jest.Mock).mockImplementation(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: mockFindExec
    }));
    
    (PageModel.countDocuments as jest.Mock).mockImplementation(() => ({
      exec: mockCountExec
    }));
    
    const result = await pageRepository.getAllTrashPages(1, 10);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.meta).toHaveProperty("total");
  });

  it("deletes permanently", async () => {
    const deleted = await pageRepository.deletePagePermanently(pageId);
    expect(deleted).toBeTruthy();
  });
});
