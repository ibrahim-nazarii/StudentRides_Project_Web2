const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  // `requireAuth` populates the session.
  return res.json({ user: req.session.user });
});

module.exports = router;

