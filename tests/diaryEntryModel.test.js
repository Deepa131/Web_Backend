const { Sequelize } = require("sequelize");
const User = require("../model/User"); 
const DiaryEntry = require("../model/DiaryEntry"); 

describe("DiaryEntry Model", () => {
  let testUser;

  beforeAll(async () => {
    await User.sync({ force: true });
    await DiaryEntry.sync({ force: true });

    testUser = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    });
  });

  afterEach(async () => {
    await DiaryEntry.destroy({ where: {} });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  it("should create a diary entry successfully", async () => {
    const diaryEntry = await DiaryEntry.create({
      selectedDate: new Date("2024-02-06"),
      dayQuality: "Good",
      thoughts: "Had a productive day!",
      highlight: "Completed a major project",
      UserUserId: testUser.id,
    });

    expect(diaryEntry.selectedDate.toISOString().split("T")[0]).toBe("2024-02-06");
    expect(diaryEntry.dayQuality).toBe("Good");
    expect(diaryEntry.thoughts).toBe("Had a productive day!");
    expect(diaryEntry.highlight).toBe("Completed a major project");
    expect(diaryEntry.UserUserId).toBe(testUser.id);
  });

  it("should not allow a diary entry without a selected date", async () => {
    try {
      await DiaryEntry.create({
        dayQuality: "Average",
        thoughts: "It was okay.",
        highlight: "Had a nice coffee",
        UserUserId: testUser.id,
      });
    } catch (error) {
      expect(error.errors[0].message).toBe("DiaryEntry.selectedDate cannot be null");
    }
  });

  it("should allow null values for dayQuality, thoughts, and highlight", async () => {
    const diaryEntry = await DiaryEntry.create({
      selectedDate: new Date("2024-02-06"),
      UserUserId: testUser.id,
    });

    expect(diaryEntry.dayQuality).toBeNull();
    expect(diaryEntry.thoughts).toBeNull();
    expect(diaryEntry.highlight).toBeNull();
  });

  it("should be associated with a user", async () => {
    const diaryEntry = await DiaryEntry.create({
      selectedDate: new Date(),
      UserUserId: testUser.id,
    });

    const user = await diaryEntry.getUser();
    expect(user.id).toBe(testUser.id);
  });

  it("should retrieve diary entries associated with a user", async () => {
    await DiaryEntry.create({
      selectedDate: new Date(),
      dayQuality: "Excellent",
      UserUserId: testUser.id,
    });

    const userWithEntries = await User.findByPk(testUser.id, {
      include: DiaryEntry,
    });

    expect(userWithEntries.DiaryEntries.length).toBe(1);
    expect(userWithEntries.DiaryEntries[0].dayQuality).toBe("Excellent");
  });
});
