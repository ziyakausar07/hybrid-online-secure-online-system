import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./welcome.css";
import voteImage from "../assets/vote.jpg";
import registerImg from "../assets/register.jpg";
import resultsImg from "../assets/results.jpg";
import electionsImg from "../assets/vote1.jpg";
import createElectionImg from "../assets/vote1.jpg";
import liveResultsImg from "../assets/results.jpg";
import appliedStudentsImg from "../assets/register.jpg";

const Welcome = () => {
  const [username, setUsername] = useState("Guest");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("🚨 No token found, redirecting to login...");
                localStorage.clear();
                navigate("/login");
                return;
            }

            console.log("📢 Token being sent:", token);

            const response = await fetch(`${API_BASE_URL}/api/welcome`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log("✅ User Data from API:", data); // ✅ Debug log

            if (!data.role) {
                console.error("❌ Role missing in response:", data);
            }

            setUsername(data.username);
            setRole(data.role);
        } catch (error) {
            console.error("🚨 Error fetching user:", error.message);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    fetchUser();
}, [navigate]);


  const renderCards = () => {
    if (role === "admin") {
      return (
        <>
          <div className="card" onClick={() => navigate("/create-election")}>
            <img src={createElectionImg} alt="Create Election" className="card-image" />
            <h2>Create Election</h2>
          </div>
          <div className="card" onClick={() => navigate("/live-results")}>
            <img src={liveResultsImg} alt="Live Results" className="card-image" />
            <h2>Live Result Update</h2>
          </div>
          <div className="card" onClick={() => navigate("/applied-students")}>
            <img src={appliedStudentsImg} alt="Applied Students" className="card-image" />
            <h2>Students Applied for Election</h2>
          </div>
        </>
      );
    } else if (role) {
      return (
        <>
          <div className="card" onClick={() => navigate("/message")}>
            <img src={electionsImg} alt="Elections" className="card-image" />
            <h2>Elections</h2>
          </div>
          <div className="card" onClick={() => navigate("/register-candidate")}>
            <img src={registerImg} alt="Register" className="card-image" />
            <h2>Candidate Registration</h2>
          </div>
          <div className="card" onClick={() => navigate("/results")}>
            <img src={resultsImg} alt="Results" className="card-image" />
            <h2>Completed Elections</h2>
          </div>
        </>
      );
    } else {
      return <h2 className="no-access">No access available</h2>;
    }
  };

  return (
    <div className="welcome-container">
      <div className="profile-round">
        <button className="profile-button" onClick={() => navigate("/profile", { state: { slider: true } })}>
          <FaUser />
        </button>
      </div>
      
      <div className="left-container">
        <img src={voteImage} alt="Voting System" />
      </div>
      
      <div className="welcome-text-container">
        {loading ? (
          <h1 className="welcome-text">Loading...</h1>
        ) : (
          <h1 className="welcome-text">Welcome, {username}!</h1>
        )}
      </div>
      
      <div className="right-container">
        <div className="card-container">
          {renderCards()}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
