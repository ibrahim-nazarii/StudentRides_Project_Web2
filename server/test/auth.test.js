const { describe, it, expect, vi, beforeEach } = require("vitest");
const request = require("supertest");

// Mock bcrypt so unit tests don't depend on bcrypt internals.
const bcryptHash = vi.fn(async () => "hashed-password");
const bcryptCompare = vi.fn(async () => true);
vi.mock("bcrypt", () => ({
  hash: bcryptHash,
  compare: bcryptCompare
}));

// Mock Knex so unit tests don't require a real Neon DB.
const getDbMock = vi.fn();
vi.mock("../src/db/knex", () => ({
  getDb: () => getDbMock()
}));

// Env must be set before importing the Express app (cookie-session uses it).
process.env.NODE_ENV = "test";
process.env.SESSION_SECRET = "test-session-secret";
process.env.FRONTEND_ORIGIN = "http://localhost:5173";

const app = require("../src/app");

function createUsersDbMock({ existingUser, insertedUser }) {
  const usersTable = {
    where: vi.fn(() => ({
      first: vi.fn(async () => existingUser)
    })),
    insert: vi.fn(() => ({
      returning: vi.fn(async () => [insertedUser])
    }))
  };

  const db = vi.fn((tableName) => {
    if (tableName !== "users") throw new Error(`Unexpected table: ${tableName}`);
    return usersTable;
  });

  return db;
}

describe("POST /auth", () => {
  beforeEach(() => {
    getDbMock.mockReset();
    bcryptHash.mockReset();
    bcryptCompare.mockReset();
    bcryptHash.mockResolvedValue("hashed-password");
    bcryptCompare.mockResolvedValue(true);
  });

  it("signup returns 400 when fields are missing", async () => {
    const res = await request(app).post("/auth/signup").send({ name: "A", email: "a@e.com" });
    expect(res.status).toBe(400);
  });

  it("signup creates a user and returns it", async () => {
    const db = createUsersDbMock({
      existingUser: null,
      insertedUser: { id: "u1", name: "Alice Driver", email: "alice@example.com" }
    });
    getDbMock.mockReturnValue(db);

    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "Alice Driver", email: "alice@example.com", password: "secret123" });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("alice@example.com");
    expect(bcryptHash).toHaveBeenCalled();
  });

  it("login returns 401 when credentials are invalid", async () => {
    const db = createUsersDbMock({
      existingUser: null,
      insertedUser: null
    });
    getDbMock.mockReturnValue(db);

    const res = await request(app).post("/auth/login").send({ email: "a@e.com", password: "secret123" });
    expect(res.status).toBe(401);
  });

  it("login sets the session when credentials are valid", async () => {
    const db = createUsersDbMock({
      existingUser: { id: "u1", name: "Alice Driver", email: "alice@example.com", password_hash: "hashed-password" },
      insertedUser: null
    });
    getDbMock.mockReturnValue(db);

    bcryptCompare.mockResolvedValue(true);

    const res = await request(app).post("/auth/login").send({ email: "alice@example.com", password: "secret123" });
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("u1");
  });
});

