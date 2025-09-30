import mongoose from "mongoose";
import newsLetterRepository from "../newsLetterRepository";
import {ENV} from "../../config/env";

beforeAll(async () => { await mongoose.connect(ENV.MONGO_URI); });
afterAll(async () => { await mongoose.connection.close(); });

describe("NewsLetterRepository", () => {
  let newsLetterId: string;

  it("creates FAQ", async () => {
    const newsLetter = await newsLetterRepository.createNewsLetter({ name: "RepoTest", slug: "repotest",template:"testing", status: "active", isDeleted: false } as any);
    expect(newsLetter.name).toBe("RepoTest");
    expect(newsLetter.slug).toBe("repotest");
    // @ts-ignore
    newsLetterId = newsLetter.id?.toString();
  });

  it("gets NewsLetter by ID", async () => {
    const found = await newsLetterRepository.getNewsLetterById(newsLetterId);
    expect(found && found.id?.toString()).toBe(newsLetterId);
  });

  it("updates NewsLetter", async () => {
    const updated = await newsLetterRepository.updateNewsLetter(newsLetterId, { name: "Updated RepoName" });
    expect(updated?.name).toBe("Updated RepoName");
  });

  it("soft deletes NewsLetter", async () => {
    const deleted = await newsLetterRepository.softDeleteNewsLetter(newsLetterId);
    expect(deleted?.isDeleted).toBe(true);
  });

  it("restores NewsLetter", async () => {
    const restored = await newsLetterRepository.restoreNewsLetter(newsLetterId);
    expect(restored?.isDeleted).toBe(false);
  });
});
