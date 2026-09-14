const express = require("express");
const axios = require("axios");
const { JAVA_BACKEND_URL } = require("../config");
const router = express.Router();

router.post("/participate", async (req, res) => {
  const { usn, name, email, college, division, department, branch, semester, position } = req.body;

  if (!usn || !name || !email || !college || !division || !department || !branch || !semester || !position) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("Received Data from React:", req.body);
  try {
    console.log("🔄 Forwarding request to Java Backend...");

    const response = await axios.post(
      `${JAVA_BACKEND_URL}/ElectionForm`,
      { usn, name, email, college, division, department, branch, semester, position },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );

    console.log("✅ Java Backend Response:", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Java Backend Error:", error.message);
    return res.status(500).json({ error: "Backend communication failed!" });
  }
});

module.exports = router;

