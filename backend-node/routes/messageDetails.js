const axios = require("axios");
const express = require("express");
const { JAVA_BACKEND_URL } = require("../config");
const router = express.Router();

router.get("/messages", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: "❌ Title is required" });
  }

  try {
    console.log(`🔍 Fetching messages for title: ${title}`);

    const response = await axios.get(`${JAVA_BACKEND_URL}/GetMessagesServlet`, {
      params: { title },
      timeout: 10000,
    });

    const messages = response.data;
    const updatedMessages = messages.map((msg) => ({
      ...msg,
      expired: msg.vote_duration === "00000",
    }));

    res.json(updatedMessages);
  } catch (error) {
    console.error("🔥 Error fetching messages from Java:", error.message);
    res.status(500).json({ message: "❌ Failed to fetch messages", error: error.message });
  }
});

module.exports = router;
