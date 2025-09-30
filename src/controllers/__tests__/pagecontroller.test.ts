import request from "supertest";
import app from "../../app";

describe("PageController Integration Tests", () => {
  let token = "";
  let pageId = "";
  const uniqueSlug = `test-page-${Date.now()}`;

  beforeAll(async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@gmail.com",
      password: "admin@123",
    });
    token = res.body.token;
  });

  // CREATE
  it("should create a Page", async () => {
    const res = await request(app)
      .post("/api/v1/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Page",
        name: "Test Name",
        slug: uniqueSlug,
        type: "template",
        description: "This is a test page",
        status: "active",
      });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Test Name");
    pageId = res.body.data._id;
  });

  it("should return 409 if Page already exists", async () => {
    const res = await request(app)
      .post("/api/v1/pages")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Page",
        name: "Test Name",
        slug: uniqueSlug,
        type: "template",
        description: "Duplicate",
        status: "active",
      });
    expect(res.status).toBe(409);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  // GET ALL
  it("should get all pages", async () => {
    const res = await request(app)
      .get("/api/v1/pages?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // GET BY ID
  it("should get page by id", async () => {
    const res = await request(app)
      .get(`/api/v1/pages/getPageById/${pageId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(pageId);
  });

  it("should return 400 if Page id is missing in getPageById", async () => {
    const res = await request(app)
      .get("/api/v1/pages/getPageById")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Page id is required");
  });

  it("should return 404 if page not found", async () => {
    const fakeId = "652f9af8c88d5d9f0d111111";
    const res = await request(app)
      .get(`/api/v1/pages/getPageById/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  // UPDATE
  it("should update a page", async () => {
    const res = await request(app)
      .put(`/api/v1/pages/updatePage/${pageId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated description" });
    expect(res.status).toBe(200);
    expect(res.body.data.description).toBe("Updated description");
  });

  it("should return 400 if Page id is missing in updatePage", async () => {
    const res = await request(app)
      .put("/api/v1/pages/updatePage")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated content" });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Page id is required");
  });

  it("should return 400 or 404 if id missing in update", async () => {
    const res = await request(app)
      .put(`/api/v1/pages/updatePage/`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "no id" });
    expect([400, 404]).toContain(res.status);
  });

  // TOGGLE STATUS
  it("should toggle page status", async () => {
    const res = await request(app)
      .patch(`/api/v1/pages/togglestatus/${pageId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(["active", "inactive"]).toContain(res.body.data.status);
  });

  it("should return 400 or 404 if id missing in toggle", async () => {
    const res = await request(app)
      .patch(`/api/v1/pages/togglestatus/`)
      .set("Authorization", `Bearer ${token}`);
    expect([400, 404]).toContain(res.status);
  });

  // SOFT DELETE
  it("should soft delete a page", async () => {
    const res = await request(app)
      .delete(`/api/v1/pages/softDeletePage/${pageId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(true);
  });

  it("should return 400 if Page id is missing in soft delete", async () => {
    const res = await request(app)
      .delete(`/api/v1/pages/softDeletePage`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Page id is required");
  });

  it("should return 404 or 400 if page not found on soft delete", async () => {
    const fakeId = "652f9af8c88d5d9f0d111111";
    const res = await request(app)
      .delete(`/api/v1/pages/softDeletePage/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([404, 400]).toContain(res.status);
  });

  // RESTORE
  it("should restore a page", async () => {
    // Soft delete first
    await request(app)
      .delete(`/api/v1/pages/softDeletePage/${pageId}`)
      .set("Authorization", `Bearer ${token}`);
    const res = await request(app)
      .patch(`/api/v1/pages/restore/${pageId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(false);
  });

  it("should return 400 or 404 if id missing in restore", async () => {
    const res = await request(app)
      .patch(`/api/v1/pages/restore/`)
      .set("Authorization", `Bearer ${token}`);
    expect([400, 404]).toContain(res.status);
  });

  // GET ALL TRASH
  it("should get all trash pages", async () => {
    // make soft delete
    await request(app)
      .delete(`/api/v1/pages/softDeletePage/${pageId}`)
      .set("Authorization", `Bearer ${token}`);
    const res = await request(app)
      .get("/api/v1/pages/trash?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // PERMANENT DELETE
  it("should permanently delete a page", async () => {
    const res = await request(app)
      .delete(`/api/v1/pages/permanentDelete/${pageId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 404 or 400 if page not found on permanent delete", async () => {
    const fakeId = "652f9af8c88d5d9f0d111111";
    const res = await request(app)
      .delete(`/api/v1/pages/permanentDelete/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([404, 400]).toContain(res.status);
  });
});