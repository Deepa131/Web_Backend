const request = require("supertest");
const app = require("../index.js"); // Ensure this points to your Express app

let authToken;
let userId;
let diaryId;
let favoriteId;
const uniqueEmail = `test${Date.now()}@example.com`;

describe("Favorite Routes", () => {
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

    // Create a diary entry to favorite
    const diaryRes = await request(app)
      .post("/diary/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        selectedDate: "2025-02-06",
        dayQuality: "Good",
        thoughts: "Had a great day!",
        highlight: "Completed all tasks",
      });

    expect(diaryRes.status).toBe(201);
    diaryId = diaryRes.body.entry.id;
  });

  it("should add a diary entry to favorites", async () => {
    const res = await request(app)
      .post("/favorites/add_favorite")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ diaryId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("newFavorite");
    favoriteId = res.body.newFavorite.id;
  });

  it("should retrieve all favorite entries for the user", async () => {
    const res = await request(app)
      .get("/favorites/get_favorite")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should retrieve a single favorite entry by ID", async () => {
    const res = await request(app)
      .get(`/favorites/${favoriteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", favoriteId);
  });

  it("should update a favorite entry", async () => {
    const newDiaryRes = await request(app)
      .post("/diary/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        selectedDate: "2025-02-07",
        dayQuality: "Excellent",
        thoughts: "Another great day!",
        highlight: "Learned something new",
      });

    expect(newDiaryRes.status).toBe(201);
    const newDiaryId = newDiaryRes.body.entry.id;

    const res = await request(app)
      .put(`/favorites/${favoriteId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ diaryId: newDiaryId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Favorite updated successfully");
  });

  it("should toggle a favorite entry", async () => {
    const res = await request(app)
      .put(`/favorites/${diaryId}/toggle`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("isFavorite");
  });

  it("should remove a favorite entry", async () => {
    const res = await request(app)
      .delete(`/favorites/${favoriteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Favorite removed successfully");
  });

  it("should return 404 for deleted favorite entry", async () => {
    const res = await request(app)
      .get(`/favorites/${favoriteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    // Cleanup: Delete the user and diary entries
    await request(app)
      .delete("/users/profile")
      .set("Authorization", `Bearer ${authToken}`);
  });
});
