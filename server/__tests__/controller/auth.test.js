const {
  register,
  login,
  logout,
  refresh,
} = require("../../controllers/authController");
const { hashPassword, comparePassword } = require("../../utils/helpers");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

jest.mock("../../utils/helpers", () => ({
  comparePassword: jest.fn(async () => true),
  hashPassword: jest.fn(async () => "hashed_password"),
}));

jest.mock("../../models/user", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  exists: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock_access_token"),
}));

// Unit Registration Test
describe("User Registration", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        email: "testuser@email.com",
        first_name: "Test",
        last_name: "User",
        password: "password123",
        password_confirm: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should register a user successfully and return 201", async () => {
    // Simulate no existing user (new registration)
    User.exists.mockResolvedValueOnce(null);

    // Simulate successful user creation
    User.create.mockResolvedValueOnce({
      id: 1,
      username: "testuser",
      email: "testuser@email.com",
      first_name: "Test",
      last_name: "User",
      password: "hashed_password",
    });

    await register(req, res);

    expect(hashPassword).toHaveBeenCalledWith("password123"); // Ensure password is hashed
    expect(User.create).toHaveBeenCalledWith({
      username: "testuser",
      email: "testuser@email.com",
      first_name: "Test",
      last_name: "User",
      password: "hashed_password",
    });

    expect(res.sendStatus).toHaveBeenCalledWith(201);
  });

  it("should return 422 if passwords do not match", async () => {
    req.body.password_confirm = "wrongpassword";

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      message: "Passwords do not match",
    });
  });

  it("should return 409 if user already exists", async () => {
    User.exists.mockResolvedValueOnce(true);

    await register(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(409);
  });

  it("should return 400 if an error occurs during registration", async () => {
    User.create.mockRejectedValueOnce(new Error("Database Error"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Could not register",
    });
  });
});

// Unit Login Test
describe("User Login", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "testuser@email.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should login a user successfully and return 200 with a token", async () => {
    const mockUser = {
      id: 1,
      email: "testuser@email.com",
      password: "hashed_password",
      save: jest.fn(),
    };

    // Mocking User.findOne to return a user
    User.findOne.mockResolvedValueOnce(mockUser);

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "testuser@email.com" });
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashed_password",
    );
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(res.cookie).toHaveBeenCalledWith(
      "refresh_token",
      "mock_access_token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      }),
    );
    expect(res.json).toHaveBeenCalledWith({
      access_token: "mock_access_token",
    });
  });

  it("should return 401 if credentials are incorrect", async () => {
    User.findOne.mockResolvedValueOnce(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email or password is incorrect",
    });
  });

  it("should return 422 if required fields are missing", async () => {
    req.body.email = "";

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing fields" });
  });
});

// Unit Logout Test
describe("User Logout", () => {
  let req, res;

  beforeEach(() => {
    req = {
      cookies: {
        refresh_token: "mock_refresh_token",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
      clearCookie: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should logout a user successfully and return 204", async () => {
    const mockUser = { refresh_token: "mock_refresh_token", save: jest.fn() };

    User.findOne.mockResolvedValueOnce(mockUser);

    await logout(req, res);

    expect(mockUser.refresh_token).toBeNull();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith("refresh_token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("should return 204 if no refresh token is found", async () => {
    req.cookies.refresh_token = null;

    await logout(req, res);

    expect(res.clearCookie).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});

// Unit Refresh Test
describe("Refresh Token", () => {
  let req, res;

  beforeEach(() => {
    req = {
      cookies: {
        refresh_token: "mock_refresh_token",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return a new access token if refresh token is valid", async () => {
    const mockUser = { id: 1, refresh_token: "mock_refresh_token" };

    User.findOne.mockResolvedValueOnce(mockUser);

    jwt.verify = jest.fn((token, secret, callback) =>
      callback(null, { id: 1 }),
    );
    jwt.sign = jest.fn(() => "new_mock_access_token");

    await refresh(req, res);

    expect(res.json).toHaveBeenCalledWith({
      access_token: "new_mock_access_token",
    });
  });

  it("should return 401 if refresh token is missing", async () => {
    req.cookies = {};

    await refresh(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("should return 403 if refresh token is invalid", async () => {
    User.findOne.mockResolvedValueOnce(null);

    await refresh(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("should return 403 if token verification fails", async () => {
    const mockUser = { id: 1, refresh_token: "mock_refresh_token" };
    User.findOne.mockResolvedValueOnce(mockUser);

    jwt.verify = jest.fn((token, secret, callback) =>
      callback(new Error("Token verification failed"), null),
    );

    await refresh(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it("should return 403 if decoded ID does not match user ID", async () => {
    const mockUser = { id: 1, refresh_token: "mock_refresh_token" };
    User.findOne.mockResolvedValueOnce(mockUser);

    jwt.verify = jest.fn(
      (token, secret, callback) => callback(null, { id: 2 }), // 🔹 Simulate a mismatch
    );

    await refresh(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});
