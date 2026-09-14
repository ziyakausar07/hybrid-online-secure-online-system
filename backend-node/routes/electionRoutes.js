const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const { JAVA_BACKEND_URL } = require("../config");

router.post("/createElection", authMiddleware, async (req, res) => {
  try {
    const { title, description, startDate, endDate, candidates, voteDuration } = req.body;

    if (!title || !startDate || !endDate || !candidates || candidates.length === 0 || !voteDuration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("📩 Sending Data to Java Backend...");
    const javaResponse = await axios.post(
      `${JAVA_BACKEND_URL}/CreateElectionServlet`,
      { title, description, startDate, endDate, candidates, voteDuration },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );

    console.log("📩 Java Backend Response:", javaResponse.data);

    if (!javaResponse.data.success) {
      return res.status(400).json({ error: "Election creation failed by Java Backend" });
    }

    res.status(201).json({ success: true, message: "Election created successfully in Java backend" });
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
