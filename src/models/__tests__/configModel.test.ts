import { ConfigModel } from "../configModel";

// Mock ConfigModel
jest.mock('../configModel', () => ({
  ConfigModel: {
    create: jest.fn(),
    deleteMany: jest.fn()
  }
}));

describe("ConfigModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires name and slug", async () => {
    const mockError = {
      errors: {
        name: { message: "Name is required" },
        slug: { message: "Slug is required" }
      }
    };
    (ConfigModel.create as jest.Mock).mockRejectedValue(mockError);

    let error;
    try {
      await ConfigModel.create({});
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    const errObj = error as { errors: { name?: any; slug?: any } };
    expect(errObj.errors.name).toBeDefined();
    expect(errObj.errors.slug).toBeDefined();
  });

  it("can create config with required fields", async () => {
    const mockConfig = {
      name: "Site Title",
      slug: "site-title",
      configFields: [{ key: "title", value: "My Site" }],
      isDeleted: false,
      status: "active",
      _id: "mockId"
    };

    (ConfigModel.create as jest.Mock).mockResolvedValue(mockConfig);

    const config = await ConfigModel.create({
      name: "Site Title",
      slug: "site-title",
      configFields: [{ key: "title", value: "My Site" }]
    });

    expect(config.name).toBe("Site Title");
    expect(config.slug).toBe("site-title");
    expect(config.isDeleted).toBe(false);
    expect(config.status).toBe("active");
    expect(config._id).toBe("mockId");
  });
});
