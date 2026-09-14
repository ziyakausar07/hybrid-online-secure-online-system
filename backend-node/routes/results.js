const express = require("express");
const router = express.Router();
const axios = require("axios");
const { execute } = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const { JAVA_BACKEND_URL } = require("../config");

router.get("/result", authenticateToken, async (req, res) => {
  const userEmail = req.user.email;
  console.log("User email:", userEmail);
  try {
    const rows = await execute(
      `SELECT COUNT(*) AS total FROM votes WHERE email = ?`,
      [userEmail]
    );

    const hasVoted = rows && rows.length > 0 && rows[0].total > 0;

    if (!hasVoted) {
      return res.status(403).json({ message: "User has not voted yet" });
    }

    const javaResult = await axios.get(`${JAVA_BACKEND_URL}/LiveResultServlet`);
    res.json(javaResult.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
