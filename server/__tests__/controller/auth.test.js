const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../index");
const User = require("../../models/user");
const { refresh } = require("../../controllers/authController");
require("dotenv").config();

let token; // Stores JWT token for authentication tests

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({ email: "testPass@email.com" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Registration Tests", () => {
  afterEach(async () => {
    await User.deleteMany({ email: "testPass@email.com" }); // Cleanup test users
  });

  //User Registration Test
  describe("POST /api/auth/register", () => {
    it("should register a user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "tp",
        email: "testPass@email.com",
        first_name: "Pass",
        last_name: "Test",
        password: "password",
        password_confirm: "password",
      });

      expect(res.statusCode).toEqual(201);
    });

    it("should return error for missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "tp",
        email: "",
        first_name: "Pass",
        last_name: "Test",
        password: "password",
        password_confirm: "password",
      });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("message");
    });

    it("should return error for duplicate email", async () => {
      await User.create({
        username: "tp",
        email: "testPass@email.com",
        first_name: "Pass",
        last_name: "Test",
        password: "password",
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "tp2",
        email: "testPass@email.com",
        first_name: "Pass",
        last_name: "Test",
        password: "password",
        password_confirm: "password",
      });

      expect(res.statusCode).toEqual(409);
    });

    it("should return error - passwords not matching", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "tp",
        email: "testPass@email.com",
        first_name: "Pass",
        last_name: "Test",
        password: "passwordSuccess",
        password_confirm: "password",
      });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("message");
    });
  });
});

describe("Auth Login Tests", () => {
  //Register a user once before login tests
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      username: "tp",
      email: "testPass@email.com",
      first_name: "Pass",
      last_name: "Test",
      password: "password",
      password_confirm: "password",
    });
  });

  //User Login Test
  describe("POST /api/auth/login", () => {
    it("should login a user successfully", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "testPass@email.com",
        password: "password",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("access_token");
      token = res.body.access_token;
    });
  });

  it("should return error for missing email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "",
      password: "password",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("message");
  });

  it("should return error for missing password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testPass@email.com",
      password: "",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("message");
  });

  it("should return error for incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testPass@email.com",
      password: "password1",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return error for non-existent user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testPass@test.com",
      password: "password",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });
});

describe("Auth Logout Tests", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      username: "tp",
      email: "testPass@email.com",
      first_name: "Pass",
      last_name: "Test",
      password: "password",
      password_confirm: "password",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "testPass@email.com",
      password: "password",
    });

    token = loginRes.body.access_token; // Store access token
  });

  //User Logout Test
  describe("POST /api/auth/logout", () => {
    it("should logout a user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", `refresh_token=${token}`);

      expect(res.statusCode).toEqual(204);
    });

    it("should return 204 even if refresh token is missing", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.statusCode).toEqual(204);
    });
  });
});

describe("Auth Refresh Tests", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      username: "tp",
      email: "testPass@email.com",
      first_name: "Pass",
      last_name: "Test",
      password: "password",
      password_confirm: "password",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "testPass@email.com",
      password: "password",
    });

    token = loginRes.body.access_token; // Store access token
  });

  //User Refresh Test
  describe("POST /api/auth/refresh", () => {
    it("should rteturn 401 since cookie is missing", async () => {
      const res = await request(app).post("/api/auth/refresh");

      expect(res.statusCode).toEqual(401);
    });
  });
});
