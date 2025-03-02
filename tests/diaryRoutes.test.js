const request = require("supertest");
const app = require("../index.js"); // Ensure this correctly points to your Express app

let authToken;
let userId;
let diaryId;
const uniqueEmail = `test${Date.now()}@example.com`;

describe("Diary Entry Routes", () => {
  beforeAll(async () => {
    // Register a new user
    const signupRes = await request(app)
      .post("/users/signup")
      .send({
        fullName: "John Doe",
        dob: "1990-01-01",
        email: uniqueEmail,
        address: "123 Street",
        password: "password123",
      });

    expect(signupRes.status).toBe(201);
    userId = signupRes.body.user.id;

    // Log in the user
    const loginRes = await request(app)
      .post("/users/login")
      .send({
        email: uniqueEmail,
        password: "password123",
      });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.token;
  });

  it("should create a diary entry", async () => {
    const res = await request(app)
      .post("/diary/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        selectedDate: "2025-02-06",
        dayQuality: "Good",
        thoughts: "Had a productive day!",
        highlight: "Finished a big project",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("entry");
    diaryId = res.body.entry.id;
  });

  it("should get all diary entries", async () => {
    const res = await request(app)
      .get("/diary/all")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a single diary entry by ID", async () => {
    const res = await request(app)
      .get(`/diary/${diaryId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", diaryId);
  });

  it("should update a diary entry", async () => {
    const res = await request(app)
      .put(`/diary/${diaryId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        selectedDate: "2025-02-07",
        dayQuality: "Excellent",
        thoughts: "Made great progress on my project",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Diary entry updated successfully");
  });

  it("should delete a diary entry", async () => {
    const res = await request(app)
      .delete(`/diary/${diaryId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Diary entry deleted successfully");
  });

  it("should return 404 for deleted diary entry", async () => {
    const res = await request(app)
      .get(`/diary/${diaryId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    // Clean up: Delete the user
    await request(app)
      .delete("/users/profile")
      .set("Authorization", `Bearer ${authToken}`);
  });
});
