import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaHome, FaEnvelope, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "Guest",
    email: "Not Available",
    role: "voter" // Default role
  });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.slider) {
      setIsOpen(true);
    }
  }, [location.state?.slider]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", res.data);

        if (res.data && res.data.username) {
          setUser({
            username: res.data.username || "Guest",
            email: res.data.email || "Not Available",
            role: res.data.role || "voter" // Assuming backend sends role
          });
        } else {
          console.warn("Invalid user data format:", res.data);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleOwnedElections = () => {
    if (user.role === "admin") {
      navigate("/createdElections");
    } else {
      navigate("/myVotes");
    }
  };

  return (
    <>
      {isOpen && <div className="profile-backdrop" onClick={() => setIsOpen(false)}></div>}

      <div className={`profile-container ${isOpen ? "slide-in" : ""}`}>
        <div className="user-icon">
          <FaUserCircle size={60} color="#4A90E2" />
        </div>

        <p className="user-info">{user.username} <br /> {user.email}</p>

        <ul className="profile-menu">
          <li onClick={() => navigate("/personalProfile")}>
            <FaHome className="icon" /> Profile Info
          </li>
          <li onClick={() => navigate("/collegeInfo")}>
            <FaInfoCircle className="icon" /> College Info
          </li>
          <li onClick={handleOwnedElections}>
            <FaEnvelope className="icon" /> 
            {user.role === "admin" ? "Created Elections" : "My Votes"}
          </li>
          <li className="logout" onClick={handleLogout}>
            <FaSignOutAlt className="icon" /> Log Out
          </li>
        </ul>
      </div>
    </>
  );
};

export default UserProfile;
