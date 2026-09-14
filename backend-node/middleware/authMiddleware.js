const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ISSUER, JWT_AUD } = require("../config");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Invalid token format" });
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUD,
    });

    if (!decoded || !decoded.username) {
      return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
    }

    req.user = decoded;
    console.log("✅ Token Verified, User:", req.user);
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
