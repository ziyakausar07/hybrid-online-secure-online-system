import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import axios from "axios";
import "./CollegeInfo.css";

const CollegeInfo = () => {
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    college_email: "",
    college_name: "",
    branch: "",
    semester: "",
    division: "",
    department: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [role, setRole] = useState(""); // State to store user role

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/collegeinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted && res.data) {
          setUpdatedUser(res.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const roleRes = await axios.get(`${API_BASE_URL}/api/welcome`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (roleRes.data.role) {
          setRole(roleRes.data.role); // Set role based on response
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUser();
    fetchRole();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.background =
      "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";

    return () => {
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
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // ✅ Ensure all fields are properly included
        let requestData = {
            username: updatedUser.username.trim(),
            college_email: updatedUser.college_email.trim(),
            college_name: updatedUser.college_name.trim(),
            branch: updatedUser.branch.trim(),
        };

        // ✅ Voter ke liye extra fields add karein
        if (role === "voter") {
            requestData.semester = updatedUser.semester.trim();
            requestData.division = updatedUser.division.trim();
            requestData.department = updatedUser.department.trim();
        }

        console.log("Sending data:", requestData); // 🔍 Debugging ke liye

        const res = await axios.put(
            `${API_BASE_URL}/api/updateCollegeInfo`,
            requestData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200) {
            alert("Profile updated successfully!");
            setEditMode(false);
        }
    } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
    }
};


  const isAdmin = role === "admin"; // Check if the user is admin

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
      <h2>College Information</h2>
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

        <label htmlFor="college_email">College Email:</label>
        <input
          id="college_email"
          type="email"
          name="college_email"
          value={updatedUser.college_email || ""}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your email"
          title="Enter a valid email address"
          autoComplete="email"
        />

        <label htmlFor="college_name">College Name:</label>
        <input
          id="college_name"
          type="text"
          name="college_name"
          value={updatedUser.college_name || ""}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your college name"
          title="Enter a valid college name"
          autoComplete="college_name"
        />

        <label htmlFor="branch">Branch:</label>
        <input
          id="branch"
          type="text"
          name="branch"
          value={updatedUser.branch || ""}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Enter your branch"
          title="Enter a valid branch"
          autoComplete="branch"
        />

        {!isAdmin && (
          <>
            <label htmlFor="semester">Semester:</label>
            <input
              id="semester"
              type="text"
              name="semester"
              value={updatedUser.semester || ""}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter your semester"
              title="Enter a valid semester"
              autoComplete="semester"
            />
            <label htmlFor="division">Division:</label>
            <input
              id="division"
              type="text"
              name="division"
              value={updatedUser.division || ""}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter your division"
              title="Enter a valid division"
              autoComplete="division"
            />
            <label htmlFor="department">Department:</label>
            <input
              id="department"
              type="text"
              name="department"
              value={updatedUser.department || ""}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter your department"
              title="Enter a valid department"
              autoComplete="department"
            />
          </>
        )}

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
    </div>
  );
};

export default CollegeInfo;
