import request from "supertest";
import path from "path";
import app from "../../app";
import { FooterInfoModel } from "../../models/footerinfoModel";

describe("FooterInfoController", () => {
  let token = "";
  let footerinfoId = "";

  // Authenticate before all tests
  beforeAll(async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@gmail.com",
      password: "admin@123",
    });
    token = res.body.token;
  });

  // Clear FooterInfo collection before each test to avoid conflicts
  beforeEach(async () => {
    await FooterInfoModel.deleteMany({});
  });

  it("creates a FooterInfo", async () => {
    const res = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Test Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );

    expect(res.status).toBe(201);
    expect(res.body.data.description).toBe("Test Footer");

    footerinfoId = res.body.data._id; // Save ID for later tests
    expect(footerinfoId).toBeDefined();
  });

  it("retrieves all Footerinfo", async () => {
    // First create a footer for retrieval
    const createRes = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Retrieve Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );
    footerinfoId = createRes.body.data._id;

    const res = await request(app)
      .get("/api/v1/footerinfo?page=1&limit=50")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    const items = res.body.data?.data || [];
    expect(Array.isArray(items)).toBe(true);
    const retrievedIds = items.map((f: any) => f._id.toString());

    expect(retrievedIds).toContain(footerinfoId.toString());
  });

  it("updates a FooterInfo", async () => {
    // Create first
    const createRes = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Update Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );
    footerinfoId = createRes.body.data._id;

    const res = await request(app)
      .put(`/api/v1/footerinfo/updatefooterinfo/${footerinfoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated footer description." });

    expect(res.status).toBe(200);
    expect(res.body.data.description).toBe("Updated footer description.");
  });

  it("toggles FooterInfo status", async () => {
    // Create first
    const createRes = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Toggle Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );
    footerinfoId = createRes.body.data._id;

    const res = await request(app)
      .patch(`/api/v1/footerinfo/togglestatus/${footerinfoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(["active", "inactive"]).toContain(res.body.data.status);
  });

  it("soft deletes a FooterInfo", async () => {
    const createRes = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Soft Delete Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );
    footerinfoId = createRes.body.data._id;

    const res = await request(app)
      .delete(`/api/v1/footerinfo/softDeletefooterinfo/${footerinfoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(true);
  });

  it("restores a FooterInfo", async () => {
    const createRes = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Restore Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );
    footerinfoId = createRes.body.data._id;

    // Soft delete first
    await request(app)
      .delete(`/api/v1/footerinfo/softDeletefooterinfo/${footerinfoId}`)
      .set("Authorization", `Bearer ${token}`);

    // Restore
    const res = await request(app)
      .patch(`/api/v1/footerinfo/restore/${footerinfoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(false);
  });

  it("retrieves footerinfo from trash", async () => {
    // Step 1: Create footer
    const createRes = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Trash Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );

    footerinfoId = createRes.body.data._id;

    // Step 2: Soft delete using correct route
    const softDeleteRes = await request(app)
      .delete(`/api/v1/footerinfo/softDeletefooterinfo/${footerinfoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(softDeleteRes.status).toBe(200);
    expect(softDeleteRes.body.data.isDeleted).toBe(true);

    // Step 3: Get all trash
    const res = await request(app)
      .get("/api/v1/footerinfo/trash")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    const trashedIds = res.body.data.map((f: any) => f._id.toString());
    expect(trashedIds).toContain(footerinfoId.toString());
  });



  it("permanently deletes a FooterInfo", async () => {
    const createRes = await request(app)
      .post("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Permanent Delete Footer")
      .attach(
        "logo",
        path.resolve(__dirname, "mocks/unique-controller-logo.png.jpg")
      );
    footerinfoId = createRes.body.data._id;

    const res = await request(app)
      .delete(`/api/v1/footerinfo/permanentDelete/${footerinfoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    // Confirm deletion
    const check = await request(app)
      .get("/api/v1/footerinfo")
      .set("Authorization", `Bearer ${token}`);
    const items = check.body.data?.data || [];
    const retrievedIds = items.map((f: any) => f._id.toString());
    expect(retrievedIds).not.toContain(footerinfoId.toString());
  });
});
