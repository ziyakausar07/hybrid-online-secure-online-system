import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MessageDetails.css';
import { API_BASE_URL } from "../apiConfig";

const MessageDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title } = location.state || {};
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    document.body.style.background =
      "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";
    document.body.style.minHeight = "136vh";

    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
    };
  }, []);

  useEffect(() => {
    if (title) {
      fetch(`${API_BASE_URL}/api/messages?title=${encodeURIComponent(title)}`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [title]);

  const handleVoteClick = (msg) => {
    if (!msg.expired) {
      navigate('/vote', { state: { title: msg.title, vote_duration: msg.vote_duration } });
    }
  };

  return (
    <div className="message-detail-container">
      <h2>{title || "No Title Available"}</h2>

      {messages.length > 0 ? (
        <div className="message-list">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-box ${msg.expired ? "expired" : ""}`}
              onClick={() => handleVoteClick(msg)}
              style={{
                cursor: msg.expired ? "not-allowed" : "pointer",
                opacity: msg.expired ? 0.6 : 1
              }}
            >
              <div className="message-content">
                <h3>{msg.title}</h3>
              </div>
              <div className="timesnap">
                {msg.expired ? "Expired" : msg.vote_duration}
              </div>
              <div className="status">
                Status: <strong>{msg.expired ? "Expired" : "Active"}</strong>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No messages found for this category.</p>
      )}

      <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default MessageDetail;
