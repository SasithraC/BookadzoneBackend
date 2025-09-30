import mongoose from "mongoose";
import {NewsLetter} from "../newsLettermodel";
import {ENV} from "../../config/env";

beforeAll(async () => { await mongoose.connect(ENV.MONGO_URI); });
afterAll(async () => { await mongoose.connection.close(); });

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
