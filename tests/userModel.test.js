const { Sequelize } = require("sequelize");
const User = require("../model/User");
const bcrypt = require("bcrypt");

describe("User Model", () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  it("should create a user with hashed password", async () => {
    const user = await User.create({
      username: "JaneDoe",
      email: "janedoe@example.com",
      password: "strongpassword",
      role: "admin",
    });

    expect(user.username).toBe("JaneDoe");
    expect(user.email).toBe("janedoe@example.com");
    expect(user.role).toBe("admin");

    const isPasswordHashed = await bcrypt.compare("strongpassword", user.password);
    expect(isPasswordHashed).toBe(true);
  });

  it("should require an email and password", async () => {
    try {
      await User.create({ username: "NoEmail" });
    } catch (error) {
      expect(error.errors[0].message).toBe("User.email cannot be null");
    }
  });

  it("should have a default role of 'user'", async () => {
    const user = await User.create({
      username: "DefaultUser",
      email: "default@example.com",
      password: "defaultpassword",
    });

    expect(user.role).toBe("user");
  });

  it("should validate email format", async () => {
    try {
      await User.create({
        username: "InvalidEmailUser",
        email: "invalid-email",
        password: "somepassword",
      });
    } catch (error) {
      expect(error.errors[0].message).toContain("Validation isEmail on email failed");
    }
  });

  it("should validate password length", async () => {
    try {
      await User.create({
        username: "ShortPasswordUser",
        email: "shortpass@example.com",
        password: "123",
      });
    } catch (error) {
      expect(error.errors[0].message).toContain("Validation len on password failed");
    }
  });

  it("should compare passwords correctly", async () => {
    const user = await User.create({
      username: "TestUser",
      email: "testuser@example.com",
      password: "securepassword",
    });

    const isMatch = await user.comparePassword("securepassword");
    expect(isMatch).toBe(true);

    const isWrong = await user.comparePassword("wrongpassword");
    expect(isWrong).toBe(false);
  });
});
