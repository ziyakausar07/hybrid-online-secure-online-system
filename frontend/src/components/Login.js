import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, credentials,{
        headers: { "Content-Type": "application/json" } // Ensure JSON request
    });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token); // Store JWT token
        localStorage.setItem("username", res.data.user.username); // Store username
        alert("✅ Login Successful!");
        navigate("/welcome"); // Redirect to welcome page
      } else {
        alert("❌ Login Failed: " + res.data.error);
      }
    } catch (error) {
      alert("❌ Login Failed! " + (error.response?.data?.error || "Server Error"));
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            value={credentials.username}
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            value={credentials.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
