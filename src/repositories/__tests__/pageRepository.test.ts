import mongoose from "mongoose";
import pageRepository from "../pageRepository";
import { ENV } from "../../config/env";

beforeAll(async () => { await mongoose.connect(ENV.MONGO_URI); });
afterAll(async () => { await mongoose.connection.close(); });

describe("PageRepository", () => {
  let pageId: string;

  it("creates Page", async () => {
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
    const updated = await pageRepository.updatePage(pageId, { name: "Updated RepoName" });
    expect(updated?.name).toBe("Updated RepoName");
  });

  it("soft deletes Page", async () => {
    const deleted = await pageRepository.softDeletePage(pageId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it("restores Page", async () => {
    const restored = await pageRepository.restorePage(pageId);
    expect(restored?.isDeleted).toBe(false);
  });

  it("toggles status", async () => {
    const toggled = await pageRepository.toggleStatus(pageId);
    expect(toggled?.status).toBe("inactive"); // assuming it was active, toggle to inactive
  });

  it("gets all pages", async () => {
    const result = await pageRepository.getAllPages(1, 10);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.meta).toHaveProperty("total");
  });

  it("gets all trash pages", async () => {
    const result = await pageRepository.getAllTrashPages(1, 10);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.meta).toHaveProperty("total");
  });

  it("deletes permanently", async () => {
    const deleted = await pageRepository.deletePagePermanently(pageId);
    expect(deleted).toBeTruthy();
  });
});
