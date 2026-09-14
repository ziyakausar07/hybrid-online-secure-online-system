import React, { useEffect,useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
useEffect(() => {
    // ✅ Set body background dynamically
    document.body.style.background =
      "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";
    
    // ✅ Body ko center me lane ke liye flexbox ka use
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";

    return () => {
      // ✅ Reset body background and layout on unmount
      document.body.style.background = "";
      document.body.style.display = "";
      document.body.style.justifyContent = "";
      document.body.style.alignItems = "";
      document.body.style.height = "";
      document.body.style.margin = "";
    };
}, []);
const handleChangePassword = async () => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("All fields are required!");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated! Please log in.");
      return;
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/changePassword`,
      { oldPassword, newPassword, confirmPassword },
      { headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
      }}
    );

    if (response.status === 200) {
      alert("Password changed successfully!");
      navigate("/login");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    alert(error.response?.data?.error || "Failed to change password. Please try again.");
  }
};


  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <label>Old Password:</label>
      <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
      <label>New Password:</label>
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <label>Confirm Password:</label>
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button onClick={handleChangePassword}>Change</button>
    </div>
  );
};

export default ChangePassword;
