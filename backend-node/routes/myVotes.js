// routes/myVotes.js

const express = require("express");
const axios = require("axios");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


// Java backend URL
const { JAVA_BACKEND_URL } = require("../config");

router.get("/my-votes", authMiddleware, async (req, res) => {
  const userEmail = req.user.email;

  try {
    const response = await axios.get(`${JAVA_BACKEND_URL}/MyVotesServlet`, {
      params: { email: userEmail },
    });

    res.json(response.data); // Forward response to React/frontend
  } catch (err) {
    console.error("Error fetching from Java backend:", err.message);
    res.status(500).json({ message: "Failed to fetch user votes from backend" });
  }
});

module.exports = router;
