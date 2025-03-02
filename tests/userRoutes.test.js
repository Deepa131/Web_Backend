const request = require("supertest");
const app = require("../index.js");

let authToken;
let userId;
const uniqueEmail = `test${Date.now()}@example.com`; 

describe("User Authentication & Profile Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({
        fullName: "John Doe",
        dob: "1990-01-01",
        email: uniqueEmail,
        address: "123 Street",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");

    userId = res.body.user.id;
  });

  it("should log in a user and return a token", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({
        email: uniqueEmail,
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
  });

  it("should get user profile when authenticated", async () => {
    const res = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("fullName");
    expect(res.body.fullName).toBe("John Doe");
  });

  it("should return unauthorized for profile access without token", async () => {
    const res = await request(app).get("/users/profile");

    expect([401, 403]).toContain(res.status);
    expect(res.body.message).toMatch(/unauthorized|access denied/i);
  });

  it("should update user profile", async () => {
    const res = await request(app)
      .put("/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        fullName: "John Updated",
        address: "456 New Street",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User updated successfully");
  });

  it("should delete the user profile", async () => {
    const res = await request(app)
      .delete("/users/profile")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User deleted successfully");
  });

  it("should not allow access to profile after deletion", async () => {
    const res = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${authToken}`);

    expect([401, 403]).toContain(res.status);
  });
});
