const express = require("express");
const axios = require("axios");
const { JAVA_BACKEND_URL } = require("../config");
const router = express.Router();

router.get("/createdElections", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_BACKEND_URL}/CreatedElections`, { timeout: 10000 });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching elections from Java backend:", err.message);
    res.status(500).json({ message: "Failed to fetch created elections", error: err.message });
  }
});

module.exports = router;
