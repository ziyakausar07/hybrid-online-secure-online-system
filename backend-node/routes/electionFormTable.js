const express = require("express");
const axios = require("axios");
const { JAVA_BACKEND_URL } = require("../config");
const router = express.Router();

router.use(express.json());

router.get("/candidates", async (req, res) => {
  try {
    const response = await axios.get(`${JAVA_BACKEND_URL}/ElectionFormTable`, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Java backend:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
