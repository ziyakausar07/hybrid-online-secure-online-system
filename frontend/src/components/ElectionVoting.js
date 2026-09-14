
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ElectionVoting.css";
import io from "socket.io-client";

import { API_BASE_URL } from "../apiConfig";
const socket = io(API_BASE_URL);

const ElectionVoting = () => {
    const location = useLocation();
    const { title, vote_duration } = location.state || {};

    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [message, setMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        document.body.style.background =
            "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
        document.body.style.margin = "0";

        return () => {
            document.body.style = "";
        };
    }, []);

    useEffect(() => {
        const fetchCandidates = async () => {
            if (!title || !vote_duration) {
                setMessage("Title or Vote Duration not found.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/vote`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, vote_duration }),
                });

                const data = await response.json();
                if (response.ok) {
                    setCandidates(data.candidates);
                } else {
                    setMessage(data.error || "Failed to fetch candidates.");
                }
            } catch (error) {
                setMessage("Error fetching candidates.");
            }
        };

        fetchCandidates();
    }, [title, vote_duration]);

    const handleGenerateOTP = async () => {
        if (!selectedCandidate) return setMessage("Please select a candidate first!");
        if (!email) return setMessage("Please enter your email!");

        try {
            const response = await fetch(`${API_BASE_URL}/api/generate-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {
                setOtpSent(true);
                setMessage(result.message || "OTP sent to your registered email.");
            } else {
                setMessage(result.error || "Failed to generate OTP.");
            }
        } catch (err) {
            setMessage("Error generating OTP. Try again.");
        }
    };

    const handleVerifyOTPAndVote = async () => {
        if (!otp) return setMessage("Please enter the OTP!");
        if (!selectedCandidate) return setMessage("Please select a candidate!");

        const selectedCandidateDetails = candidates.find(
            (candidate) => String(candidate.id) === selectedCandidate
        );

        if (!selectedCandidateDetails) {
            return setMessage("Invalid candidate selection!");
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp,
                    candidate_id: selectedCandidateDetails.id,
                    candidate_name: selectedCandidateDetails.name,
                    vote_title: selectedCandidateDetails.title,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message || "Vote successfully cast!");
                setOtp("");
                setOtpSent(false);
                socket.emit("voteUpdate");
            } else {
                setMessage(result.error || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            setMessage("Error verifying OTP. Try again.");
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
                padding: "20px",
                borderRadius: "10px",
                color: "#fff",
                maxWidth: "400px",
            }}
        >
            <h1>Election Voting System</h1>

            {title && (
                <>
                    <h3>{title}</h3>
                    <p>Duration: {vote_duration}</p>
                </>
            )}

            <h3>Candidates:</h3>
            <ul>
                {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                        <li key={candidate.id}>
                            <input
                                type="radio"
                                name="candidate"
                                value={String(candidate.id)}
                                checked={selectedCandidate === String(candidate.id)}
                                onChange={(e) => setSelectedCandidate(e.target.value)}
                            />
                            {candidate.name} - {title}
                        </li>
                    ))
                ) : (
                    <p>No candidates available</p>
                )}
            </ul>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {!otpSent ? (
                <button
                    onClick={handleGenerateOTP}
                    disabled={!selectedCandidate || !email}
                >
                    Generate OTP & Vote
                </button>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                        onClick={handleVerifyOTPAndVote}
                        disabled={!otp}
                    >
                        Submit OTP & Vote
                    </button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default ElectionVoting;
