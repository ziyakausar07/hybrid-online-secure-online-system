import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PersonalProfile.css";
import { API_BASE_URL } from "../apiConfig";

const PersonalProfile = () => {
  const [updatedUser, setUpdatedUser] = useState({
    userId: "",  
    username: "",
    email: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted && res.data) {
          setUpdatedUser({
            userId: res.data.userId, 
            username: res.data.username,
            email: res.data.email,
            phone: res.data.phone,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

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

  
  const handleEditClick = () => setEditMode(true);

  const handleChange = (e) => {
    setUpdatedUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.put(
        `${API_BASE_URL}/api/update`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        alert("Profile updated successfully!");
        setEditMode(false);
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div
      className="profile-container"
      style={{
        top: "50%",
        left: "0%",
        alignItems: "center",
        height: "auto",
        background:
          "radial-gradient(circle at top left, #1e3c72, #2a5298, transparent 50%), radial-gradient(circle at bottom right, #ff758c, #ff7eb3, transparent 50%), linear-gradient(135deg, #141e30, #243b55)",
        textAlign: "left",
        position: "relative",
        zIndex: 9999,
      }}
    >
      <h2>Personal Profile</h2>

      <div className="profile-details">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={updatedUser.username || ""}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your username"
          title="Enter your unique username"
          autoComplete="username"
        />

        <label htmlFor="email">Personal Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={updatedUser.email || ""}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your email"
          title="Enter a valid email address"
          autoComplete="email"
        />

        <label htmlFor="phone">Phone Number:</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={updatedUser.phone || ""}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your phone number"
          title="Enter your 10-digit mobile number"
          autoComplete="tel"
        />

        {editMode ? (
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
        ) : (
          <button onClick={handleEditClick} className="edit-btn">
            Edit
          </button>
        )}
      </div>

      <button onClick={() => navigate("/changePassword")} className="change-pass-btn">
        Change Password
      </button>
    </div>
  );
};

export default PersonalProfile;
