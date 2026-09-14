const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const { JAVA_BACKEND_URL } = require("../config");


router.get("/user", authMiddleware, async (req, res) => {
    try {
        console.log("User from token:", req.user);
        if (!req.user || !req.user.username) {
            return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
        }
        const username = req.user.username;

        // ✅ Corrected: Passing username as a query parameter
        const servletResponse = await axios.get(`${JAVA_BACKEND_URL}/UserProfile?username=${username}`);

        if (servletResponse.data.error) {
            return res.status(404).json({ error: "User role not found" });
        }

        return res.json(servletResponse.data);
    } catch (err) {
        console.error("Error forwarding request to Java Servlet:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
