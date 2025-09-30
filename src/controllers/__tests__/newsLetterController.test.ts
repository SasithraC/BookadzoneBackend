import request from "supertest";
import app from "../../app"; // un app entry point import

describe("NewsLetterController Integration Tests", () => {
  let token = "";
  let newsLetterId = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@gmail.com",
      password: "admin@123",
    });
    token = res.body.token;
  });

  // CREATE
  it("should create a NewsLetter", async () => {
    const res = await request(app)
      .post("/api/v1/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test NewsLetter",
        slug: "test-newsletter",
        template: "This is a template",
        status: "active",
      });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Test NewsLetter");
    newsLetterId = res.body.data._id;
  });

  it("should return 409 if NewsLetter already exists", async () => {
    const res = await request(app)
      .post("/api/v1/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test NewsLetter",
        slug: "test-newsletter",
        template: "duplicate",
        status: "active",
      });
    expect(res.status).toBe(409);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  // GET ALL
  it("should get all newsletters", async () => {
    const res = await request(app)
      .get("/api/v1/newsletters?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // GET BY ID
  it("should get newsletter by id", async () => {
    const res = await request(app)
      .get(`/api/v1/newsletters/getNewsLetterById/${newsLetterId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(newsLetterId);
  });

it("should return 400 if NewsLetter id is missing in getNewsLetterById", async () => {
  const res = await request(app)
    .get("/api/v1/newsletters/getNewsLetterById") // no id passed
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(400);
  expect(res.body.status).toBe(false);
  expect(res.body.message).toBe("NewsLetter id is required");
});



  it("should return 404 if newsletter not found", async () => {
    const fakeId = "652f9af8c88d5d9f0d111111";
    const res = await request(app)
      .get(`/api/v1/newsletters/getNewsLetterById/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  // UPDATE
  it("should update a newsletter", async () => {
    const res = await request(app)
      .put(`/api/v1/newsletters/updateNewsLetter/${newsLetterId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ template: "Updated template" });
    expect(res.status).toBe(200);
    expect(res.body.data.template).toBe("Updated template");
  });

  it("should return 400 if NewsLetter id is missing in updateNewsLetter", async () => {
  const res = await request(app)
    .put("/api/v1/newsletters/updateNewsLetter") // no id passed
    .set("Authorization", `Bearer ${token}`)
    .send({ template: "Updated content" }); // sample body

  expect(res.status).toBe(400);
  expect(res.body.status).toBe(false); // controller la FAIL nu return panra
  expect(res.body.message).toBe("NewsLetter id is required");
});


  it("should return 400 if id missing in update", async () => {
    const res = await request(app)
      .put(`/api/v1/newsletters/updateNewsLetter/`)
      .set("Authorization", `Bearer ${token}`)
      .send({ template: "no id" });
    expect([400, 404]).toContain(res.status);
  });

  // TOGGLE STATUS
  it("should toggle newsletter status", async () => {
    const res = await request(app)
      .patch(`/api/v1/newsletters/togglestatus/${newsLetterId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(["active", "inactive"]).toContain(res.body.data.status);
  });

  it("should return 400 if id missing in toggle", async () => {
    const res = await request(app)
      .patch(`/api/v1/newsletters/togglestatus/`)
      .set("Authorization", `Bearer ${token}`);
    expect([400, 404]).toContain(res.status);
  });

  // SOFT DELETE
  it("should soft delete a newsletter", async () => {
    const res = await request(app)
      .delete(`/api/v1/newsletters/softDeleteNewsLetter/${newsLetterId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(true);
  });

    it("should return 400 if NewsLetter id is missing in soft delete", async () => {
  const res = await request(app)
    .delete(`/api/v1/newsletters/softDeleteNewsLetter`) // no id passed
    .set("Authorization", `Bearer ${token}`)
  expect(res.status).toBe(400);
  expect(res.body.status).toBe(false); // controller la FAIL nu return panra
  expect(res.body.message).toBe("NewsLetter id is required");
});

  it("should return 404 if newsletter not found on soft delete", async () => {
    const fakeId = "652f9af8c88d5d9f0d111111";
    const res = await request(app)
      .delete(`/api/v1/newsletters/softDeleteNewsLetter/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([404, 400]).toContain(res.status);
  });

  // RESTORE
  it("should restore a newsletter", async () => {
    const res = await request(app)
      .patch(`/api/v1/newsletters/restore/${newsLetterId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(false);
  });

  it("should return 400 if id missing in restore", async () => {
    const res = await request(app)
      .patch(`/api/v1/newsletters/restore/`)
      .set("Authorization", `Bearer ${token}`);
    expect([400, 404]).toContain(res.status);
  });

  // GET ALL TRASH
  it("should get all trash newsletters", async () => {
    // make soft delete
    await request(app)
      .delete(`/api/v1/newsletters/softDeleteNewsLetter/${newsLetterId}`)
      .set("Authorization", `Bearer ${token}`);
    const res = await request(app)
      .get("/api/v1/newsletters/trash?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // PERMANENT DELETE
  it("should permanently delete a newsletter", async () => {
    const res = await request(app)
      .delete(`/api/v1/newsletters/permanentDelete/${newsLetterId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 404 if newsletter not found on permanent delete", async () => {
    const fakeId = "652f9af8c88d5d9f0d111111";
    const res = await request(app)
      .delete(`/api/v1/newsletters/permanentDelete/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([404, 400]).toContain(res.status);
  });
});
