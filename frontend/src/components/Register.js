import React, { useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    usn: "",
    username: "",
    email: "",
    password: "",
    role: "voter",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataToSend = { ...user };
      if (user.role.toLowerCase() === "admin") {
        const { usn, ...rest } = dataToSend;
        dataToSend = rest;
      }

      console.log("Sending data to server:", dataToSend);
      const res = await axios.post(`${API_BASE_URL}/api/register`, dataToSend);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username); // Store username
        alert("✅ Signup Successful!");
        navigate("/welcome");
      } else {
        alert("❌ Signup Failed: " + res.data.error);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("❌ Signup Failed! " + (error.response?.data?.error || "Server Error"));
    }
  };

  return (
    <div className="register-page">
      <div className="background-animation"></div>
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          {user.role !== "admin" && (
            <input type="text" name="usn" value={user.usn} placeholder="USN" onChange={handleChange} required />
          )}
          <input type="text" name="username" value={user.username} placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" value={user.email} placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" value={user.password} placeholder="Password" onChange={handleChange} required />
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Register</button>
          <p>Already have an account? <Link to="/login" className="link">Login here</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
