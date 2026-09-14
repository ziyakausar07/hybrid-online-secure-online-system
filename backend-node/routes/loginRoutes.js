const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ISSUER, JWT_AUD, JAVA_BACKEND_URL } = require("../config");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required!" });
    }

    console.log("🔄 Forwarding request to Java Backend...");

    const response = await axios.post(
      `${JAVA_BACKEND_URL}/UserAuth`,
      { username, email, password },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );

    console.log("✅ Response from Java Backend:", response.data);

    if (!response.data.success) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username, email, role: response.data.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
        algorithm: "HS256",
        issuer: JWT_ISSUER,
        audience: JWT_AUD,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { username, email, role: response.data.role },
    });
  } catch (error) {
    console.error("❌ Error communicating with Java Backend:", error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
