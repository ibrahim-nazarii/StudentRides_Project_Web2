function requireAuth(req, res, next) {
  // cookie-session stores the session in req.session
  if (!req.session || !req.session.user) return res.status(401).json({ error: "Unauthorized" });
  next();
}

module.exports = { requireAuth };

