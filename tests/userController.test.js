const { signupUser, loginUser, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../model/User", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("User Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should register a new user", async () => {
    const req = { body: { username: "JohnDoe", email: "john@example.com", password: "password123" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    User.create.mockResolvedValue({ id: 1, ...req.body, password: "hashedPassword" });

    await signupUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ email: req.body.email }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Signup successful!" });
  });

  it("should return an error if user already exists", async () => {
    const req = { body: { email: "existing@example.com" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ id: 1, email: req.body.email });

    await signupUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
  });

  it("should log in a user with valid credentials", async () => {
    const req = { body: { email: "john@example.com", password: "password123" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ id: 1, email: req.body.email, password: "hashedPassword", username: "JohnDoe" });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, "hashedPassword");
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "mockToken" }));
  });

  it("should return an error for invalid credentials", async () => {
    const req = { body: { email: "john@example.com", password: "wrongpassword" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ id: 1, email: req.body.email, password: "hashedPassword", username: "JohnDoe" });
    bcrypt.compare.mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
  });

  it("should return user profile by ID", async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    User.findByPk.mockResolvedValue({ id: 1, username: "JohnDoe", email: "john@example.com" });

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1, { attributes: ["id", "username", "email"] });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: "JohnDoe" }));
  });

  it("should return error if user not found", async () => {
    const req = { params: { id: 999 } };
    const res = mockResponse();

    User.findByPk.mockResolvedValue(null);

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should update user information", async () => {
    const req = { params: { id: 1 }, body: { username: "UpdatedUser" } };
    const res = mockResponse();

    const mockUser = { id: 1, username: "JohnDoe", email: "john@example.com", update: jest.fn() };
    User.findByPk.mockResolvedValue(mockUser);
    mockUser.update.mockResolvedValue(mockUser);

    await updateUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(mockUser.update).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "User updated successfully" }));
  });

  it("should return error if user not found during update", async () => {
    const req = { params: { id: 999 }, body: { username: "UpdatedUser" } };
    const res = mockResponse();

    User.findByPk.mockResolvedValue(null);

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should delete a user successfully", async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    const mockUser = { id: 1, username: "JohnDoe", email: "john@example.com", destroy: jest.fn() };
    User.findByPk.mockResolvedValue(mockUser);
    mockUser.destroy.mockResolvedValue();

    await deleteUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(mockUser.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
  });

  it("should return error if user not found during delete", async () => {
    const req = { params: { id: 999 } };
    const res = mockResponse();

    User.findByPk.mockResolvedValue(null);

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});
