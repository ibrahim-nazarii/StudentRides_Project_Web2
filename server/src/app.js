const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieSession = require("cookie-session");

const { requireAuth } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");
const ridesRoutes = require("./routes/rides");
const reservationRoutes = require("./routes/reservations");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Cookie-based sessions (set by /auth endpoints)
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "dev-insecure-session-secret"],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);

// Simple root route for quick sanity checks.
app.get("/", (req, res) => res.json({ ok: true, service: "student-rides-sharing" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/me", requireAuth, meRoutes);

app.use("/rides", requireAuth, ridesRoutes);
app.use("/reservations", requireAuth, reservationRoutes);

app.use((err, req, res, next) => {
  // Basic error handler; real routes will format errors consistently later.
  // eslint-disable-next-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;

