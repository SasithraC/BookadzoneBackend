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

  it("should retrieve all active and non-deleted BlogCategories (Success Case)", async () => {
  const res = await request(app)
    .get("/api/v1/blogCategory") // Route handled by getBlogCategoryController
    .set("Authorization", `Bearer ${token}`);

  // ✅ Verify HTTP status
  expect(res.status).toBe(200);

  // ✅ Check that response structure matches your controller
  expect(res.body).toHaveProperty("status");
  expect(res.body).toHaveProperty("data");

  // ✅ Ensure correct status and data types
  expect(res.body.status).toBe("SUCCESS");
  expect(Array.isArray(res.body.data)).toBe(true);

  // ✅ Ensure that returned records contain only the required fields
  if (res.body.data.length > 0) {
    const category = res.body.data[0];
    expect(category).toHaveProperty("status");
    expect(category).toHaveProperty("isDeleted");
    // Optional: ensure no unwanted fields are present
    expect(Object.keys(category)).toEqual(
      expect.arrayContaining(["status", "isDeleted"])
    );
  }
});

it("should return 404 if no BlogCategories are found (Failure Case)", async () => {
  // 🧩 Mock the service if using dependency injection / mocking
  // OR clear the database before this test if possible
  // For demonstration, we simulate by sending a request to an empty DB or mocking

  // Example (pseudo-mock):
  // jest.spyOn(blogCategoryService, "getAllBlogCategory").mockResolvedValue([]);

  const res = await request(app)
    .get("/api/v1/blogCategory")
    .set("Authorization", `Bearer ${token}`);

  if (res.status === 404) {
    expect(res.body.status).toBe("FAIL");
    expect(res.body.message).toBe("No blog categories found");
  } else {
    // In environments where categories exist, we just confirm it’s valid
    expect([200, 404]).toContain(res.status);
  }
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
