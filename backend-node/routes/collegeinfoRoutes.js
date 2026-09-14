const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const { JAVA_BACKEND_URL } = require("../config");


const router = express.Router();
router.use(express.json());

router.get("/collegeinfo", authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.username) {
            return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
        }

        const userUsername = req.user.username;

        // Proceed to fetch college info (No role check from Java Backend)
        const javaResponse = await axios.get(`${JAVA_BACKEND_URL}/CollegeInfoServlet?username=${userUsername}`);

        if (javaResponse.data.error) {
            return res.status(404).json({ error: "College info not found" });
        }
        res.status(200).json(javaResponse.data);

    } catch (err) {
        console.error("Java Backend Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to fetch college info via Java Backend" });
    }
});

router.put("/updateCollegeInfo", authMiddleware, async (req, res) => {
    try {
        const { username, college_email, college_name, branch, semester, department, division } = req.body;

        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(college_email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Proceed to update college info (No role check from Java Backend)
        const javaResponse = await axios.put(`${JAVA_BACKEND_URL}/UpdateCollegeInfoServlet`, {
            username, college_email, college_name, branch, semester, department, division
        }, { headers: { "Content-Type": "application/json" } });

        if (!javaResponse.data.success) {
            return res.status(400).json({ success: false, error: "Update failed" });
        }

        res.status(200).json({ success: true, message: "College info updated successfully" });

    } catch (err) {
        console.error("Java Backend Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to update college info via Java Backend" });
    }
});

module.exports = router;
