const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const { JAVA_BACKEND_URL } = require("../config");


const router = express.Router();

// Middleware to parse JSON
router.use(express.json());

// Fetch User Profile
router.get("/userprofile", authMiddleware, async (req, res) => {
    try {
        console.log("User from token:", req.user);
        if (!req.user || !req.user.username) {
            return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
        }

        const userUsername = req.user.username;
        console.log("🔹 Fetching User Profile from Java Backend using User Username:", { userUsername });

        const javaResponse = await axios.get(`${JAVA_BACKEND_URL}/PersonalProfile?username=${userUsername}`);

        console.log("✅ Java Backend Response:", javaResponse.data);
        if (javaResponse.data.error) {
            return res.status(404).json({ error: "User profile not found" });
        }
        res.status(javaResponse.status).json(javaResponse.data);
    } catch (err) {
        console.error("❌ Java Backend Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to fetch user profile via Java Backend" });
    }
});

// Update User Profile
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { username, email, phone } = req.body;

        if (!username || !email || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        console.log("🔹 Sending Update Request to Java Backend:", { username, email, phone });

        // Send the username instead of userId
        const javaResponse = await axios.put(`${JAVA_BACKEND_URL}/UpdateProfile`, {
            username, email, phone
        }, { headers: { "Content-Type": "application/json" } });

        if (!javaResponse.data.success) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        res.status(javaResponse.status).json(javaResponse.data);
    } catch (err) {
        console.error("❌ Java Backend Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to update profile via Java Backend" });
    }
});

// 🟢 Change Password (Handled by Java Backend)
router.put("/changePassword", authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const username = req.user.username;  // Use username instead of userId

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "New password and confirm password do not match!" });
        }

        console.log("🔹 Request to Java Backend:", { username, oldPassword, newPassword, confirmPassword });

        const javaResponse = await axios.post(`${JAVA_BACKEND_URL}/ChangePasswordServlet`, {
            username,  // Sending username to Java backend
            oldPassword,
            newPassword,
            confirmPassword,  // ✅ Added confirmPassword
        });

        console.log("✅ Java Backend Response:", javaResponse.data);

        res.status(javaResponse.status).json(javaResponse.data);
    } catch (error) {
        console.error("❌ Java Backend Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to change password via Java Backend" });
    }
});



module.exports = router;
