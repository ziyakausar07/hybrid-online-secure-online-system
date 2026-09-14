const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ISSUER, JWT_AUD, JAVA_BACKEND_URL } = require("../config");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("🔹 Incoming Registration Request:", req.body);

    let { usn, username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      console.log("Error: Missing fields in registration data");
      return res.status(400).json({ success: false, error: "All fields are required!" });
    }

    if (!["voter", "admin"].includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, error: "Invalid role! Must be 'voter' or 'admin'." });
    }

    if (role.toLowerCase() === "admin") {
      usn = null;
    } else if (!usn) {
      return res.status(400).json({ success: false, error: "USN is required for voters!" });
    }

    console.log("📡 Sending data to Java Servlet...");
    const servletResponse = await axios.post(
      `${JAVA_BACKEND_URL}/RegisterUser`,
      { usn, username, email, password, role },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );

    console.log("✅ Servlet Response:", servletResponse.data);

    if (servletResponse.data.success) {
      const token = jwt.sign(
        { username, email, role },
        JWT_SECRET,
        {
          expiresIn: "1h",
          algorithm: "HS256",
          issuer: JWT_ISSUER,
          audience: JWT_AUD,
        }
      );

      console.log("🛠 Generated Token:", token);

      res.status(201).json({
        success: true,
        message: "User registered successfully!",
        token,
      });
    } else {
      res.status(400).json({ success: false, error: servletResponse.data.error || "Registration failed at backend!" });
    }
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
