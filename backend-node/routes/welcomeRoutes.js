const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");  // Java API call karne ke liye
const { JAVA_BACKEND_URL } = require("../config");


router.get("/welcome", authMiddleware, async (req, res) => {
    try {
        console.log("User from token:", req.user);

        if (!req.user || !req.user.username) {
            return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
        }

        const username = req.user.username;

        // ✅ Java Servlet ko call karo
        const javaApiUrl = `${JAVA_BACKEND_URL}/WelcomeServlet?username=${username}`;
        const javaResponse = await axios.get(javaApiUrl);

        if (javaResponse.data.error) {
            return res.status(404).json({ error: "User role not found" });
        }

        const role = javaResponse.data.role;
        console.log("Fetched Role:", role);

        res.json({ username, role });

    } catch (err) {
        console.error("Error fetching role from Java Servlet:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
