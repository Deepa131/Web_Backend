const { Sequelize } = require("sequelize");
const User = require("../model/User");
const DiaryEntry = require("../model/DiaryEntry");
const FavoriteDay = require("../model/FavoriteDay");

describe("FavoriteDay Model", () => {
  let testUser, testDiaryEntry;

  beforeAll(async () => {
    await User.sync({ force: true });
    await DiaryEntry.sync({ force: true });
    await FavoriteDay.sync({ force: true });

    testUser = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    });

    testDiaryEntry = await DiaryEntry.create({
      selectedDate: new Date("2024-02-06"),
      dayQuality: "Amazing",
      thoughts: "Had a great day!",
      highlight: "Got a promotion!",
      UserUserId: testUser.id,
    });
  });

  afterEach(async () => {
    await FavoriteDay.destroy({ where: {} });
  });

  afterAll(async () => {
    await DiaryEntry.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it("should create a favorite day entry successfully", async () => {
    const favoriteDay = await FavoriteDay.create({
      userId: testUser.id,
      diaryId: testDiaryEntry.entryId,
    });

    expect(favoriteDay.userId).toBe(testUser.id);
    expect(favoriteDay.diaryId).toBe(testDiaryEntry.entryId);
  });

  it("should require both userId and diaryId", async () => {
    try {
      await FavoriteDay.create({});
    } catch (error) {
      expect(error.errors.length).toBeGreaterThan(0);
    }
  });

  it("should associate a favorite day with a diary entry", async () => {
    const favoriteDay = await FavoriteDay.create({
      userId: testUser.id,
      diaryId: testDiaryEntry.entryId,
    });

    const diaryEntry = await favoriteDay.getDiaryEntry();

    expect(diaryEntry.entryId).toBe(testDiaryEntry.entryId);
    expect(diaryEntry.dayQuality).toBe("Amazing");
  });

  it("should not allow a favorite day without a valid diary entry", async () => {
    try {
      await FavoriteDay.create({
        userId: testUser.id,
        diaryId: 9999,
      });
    } catch (error) {
      expect(error.message).toContain("foreign key constraint fails");
    }
  });
});
