// routes/votePage.js
const express = require("express");
const axios = require("axios");
const { JAVA_BACKEND_URL } = require("../config");

const router = express.Router();

router.all("/vote", async (req, res) => {
  const method = req.method;
  const { title, vote_duration } = req.body;

  try {
    // Handle POST request
    if (method === "POST" && title && vote_duration) {
      // Forward the request to another backend service for fetching candidates
      const response = await axios.post(`${JAVA_BACKEND_URL}/VotePage`, {
        title,
        vote_duration,
      });

      // Return the list of candidates received from the external service
      return res.json({ candidates: response.data.candidates || [] });

    } 
    // Handle invalid requests
    else {
      return res.status(400).json({ error: "Invalid request or missing data" });
    }

  } catch (error) {
    console.error("Error in /vote:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Generate OTP
router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await axios.post(`${JAVA_BACKEND_URL}/GenerateOTPServlet`, {
      email,
    });

    if (response.data.success) {
      res.json({ message: "OTP sent successfully!" });
    } else {
      res.status(400).json({ error: "Failed to generate OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error generating OTP" });
  }
});
// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
    let { email, otp, candidate_id, candidate_name, vote_title } = req.body;
  
    // 🧹 Trim & sanitize inputs
    email = email?.trim().toLowerCase();
    otp = otp?.trim();
    const payload = {
        email,
        otp,
        candidate_id,
        candidate_name,
        vote_title,
      };
    
      console.log("🛰 Sending payload to VerifyOTPServlet:", payload);
    // ✅ Validate required fields
    if (!email || !otp || !candidate_id || !candidate_name || !vote_title) {
      return res.status(400).json({ error: "All fields are required!" });
    }
  
    
    try {
      const response = await axios.post(
        `${JAVA_BACKEND_URL}/VerifyOTPServlet`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("✅ Response from VerifyOTPServlet:", response.data);
  
      if (response.data.success) {
        return res.json({ message: response.data.message || "Vote cast successfully!" });
      } else {
        return res.status(400).json({ error: response.data.error || "Invalid OTP or already voted" });
      }
  
    } catch (error) {
      console.error("🚨 Error verifying OTP:", error.message);
      return res.status(500).json({ error: "Server error verifying OTP" });
    }
  });
  


module.exports = router;