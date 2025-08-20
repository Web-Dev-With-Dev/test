const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Extract the token from Authorization header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied: No token provided" });
  }

  // Remove "Bearer " prefix
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Proceed
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
