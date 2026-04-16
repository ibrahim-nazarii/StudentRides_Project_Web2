const express = require("express");
const bcrypt = require("bcrypt");

const { getDb } = require("../db/knex");

const router = express.Router();

// Helpful responses for browser users who accidentally try GET on POST-only endpoints.
router.get("/signup", (req, res) => res.status(405).json({ error: "Use POST /auth/signup" }));
router.get("/login", (req, res) => res.status(405).json({ error: "Use POST /auth/login" }));

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== "string") return res.status(400).json({ error: "Missing name" });
  if (!email || typeof email !== "string") return res.status(400).json({ error: "Missing email" });
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const db = getDb();

  const existing = await db("users").where({ email }).first();
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const password_hash = await bcrypt.hash(password, 10);
  const inserted = await db("users")
    .insert({ name, email, password_hash })
    .returning(["id", "name", "email"]);

  // Postgres returns an array of rows for `.returning()`
  const user = Array.isArray(inserted) ? inserted[0] : inserted;

  req.session.user = { id: user.id, name: user.name, email: user.email };
  return res.status(201).json({ user: req.session.user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== "string") return res.status(400).json({ error: "Missing email" });
  if (!password || typeof password !== "string") return res.status(400).json({ error: "Missing password" });

  const db = getDb();

  const user = await db("users").where({ email }).first();
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  req.session.user = { id: user.id, name: user.name, email: user.email };
  return res.json({ user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session = null;
  return res.status(204).send();
});

module.exports = router;

