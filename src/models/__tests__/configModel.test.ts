import mongoose from "mongoose";
import { ConfigModel } from "../configModel";
import {ENV} from "../../config/env";

beforeAll(async () => { await mongoose.connect(ENV.MONGO_URI); });
afterAll(async () => { await mongoose.connection.close(); });

describe("ConfigModel", () => {
  beforeEach(async () => { await ConfigModel.deleteMany({}); });

  it("requires name and slug", async () => {
    const config = new ConfigModel({});
    let error;
    try { await config.save(); } catch (e) { error = e; }
    expect(error).toBeDefined();
    if (error && typeof error === "object" && "errors" in error) {
      const err = error as { errors: { [key: string]: any } }
      expect(err.errors.name).toBeDefined();
      expect(err.errors.slug).toBeDefined();
    }
  });

  it("can create config with required fields", async () => {
    const config = await ConfigModel.create({
      name: "Site Title",
      slug: "site-title",
      configFields: [{ key: "title", value: "My Site" }]
    });
    expect(config.name).toBe("Site Title");
    expect(config.slug).toBe("site-title");
    expect(config.isDeleted).toBe(false);
    expect(config.status).toBe("active");
  });
});
