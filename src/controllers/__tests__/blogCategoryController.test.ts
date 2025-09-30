import request from "supertest";
import app from "../../app";

describe("BlogCategoryController", () => {
  let token = "";
  let categoryId = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@gmail.com",
      password: "admin@123",
    });
    token = res.body.token;
  });

  it("returns 409 if BlogCategory already exists", async () => {
    const categoryData = { name: "Duplicate Category", status: "active" };
    await request(app)
      .post("/api/v1/blogCategory")
      .set("Authorization", `Bearer ${token}`)
      .send(categoryData);

    const res = await request(app)
      .post("/api/v1/blogCategory")
      .set("Authorization", `Bearer ${token}`)
      .send(categoryData);

    expect([409, 400]).toContain(res.status);
  });

  it("creates a BlogCategory", async () => {
    const res = await request(app)
      .post("/api/v1/blogCategory")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Category", status: "active" });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Test Category");
    categoryId = res.body.data._id;
  });

  it("retrieves all BlogCategories", async () => {
    const res = await request(app)
      .get("/api/v1/blogCategory")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("retrieves a BlogCategory by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/blogCategory/getblogCategoryById/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toEqual(categoryId);
  });

  it("updates a BlogCategory", async () => {
    const res = await request(app)
      .put(`/api/v1/blogCategory/updateblogCategory/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Category" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Category");
  });

  it("toggles BlogCategory status", async () => {
    const res = await request(app)
      .patch(`/api/v1/blogCategory/togglestatus/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(["active", "inactive"]).toContain(res.body.data.status);
  });

  it("soft deletes a BlogCategory", async () => {
    const res = await request(app)
      .delete(`/api/v1/blogCategory/softDeleteblogCategory/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(true);
  });

  it("restores a BlogCategory", async () => {
    const res = await request(app)
      .patch(`/api/v1/blogCategory/restore/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isDeleted).toBe(false);
  });

  it("retrieves BlogCategories from trash", async () => {
    await request(app)
      .delete(`/api/v1/blogCategory/trash/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .get("/api/v1/blogCategory/trash/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("permanently deletes a BlogCategory", async () => {
    const res = await request(app)
      .delete(`/api/v1/blogCategory/permanentDelete/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
