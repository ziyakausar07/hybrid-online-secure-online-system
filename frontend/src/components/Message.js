import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Message.css';

const Message = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background =
      "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";
    document.body.style.minHeight = "136vh";
    document.body.style.margin = "0";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";

    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
      document.body.style.margin = "";
      document.body.style.display = "";
    };
  }, []);

  const handleClick = (title, description) => {
    navigate('/message-detail', { state: { title, description } });
  };

  return (
    <div className="message-container">
      <div className="message-box" onClick={() => handleClick('Class Representative', 'The Class Representative is responsible for representing students...')}>
        <h3>Class Representative</h3>
        <p>The Class Representative is responsible for representing students' concerns and liaising with teachers and management.</p>
      </div>
      <div className="message-box" onClick={() => handleClick('Ladies Representative', 'The Ladies Representative works to address concerns specific to female students...')}>
        <h3>Ladies Representative</h3>
        <p>The Ladies Representative works to address concerns specific to female students and promotes women’s welfare activities.</p>
      </div>
      <div className="message-box" onClick={() => handleClick('President', 'The President leads the student body, oversees all student activities...')}>
        <h3>President</h3>
        <p>The President leads the student body, oversees all student activities, and coordinates with school management and external parties.</p>
      </div>
      <div className="message-box" onClick={() => handleClick('Vice President', 'The Vice President assists the President and steps in during the President\'s absence...')}>
       <h3>Vice President</h3>
        <p>The Vice President assists the President and steps in during the President's absence. They also help in organizing major events.</p>
      </div>
      <div className="message-box" onClick={() => handleClick('Secretary', 'The Secretary manages the student council\'s records, including meeting minutes, event schedules...')}>
       <h3>Secretary</h3>
        <p>The Secretary manages the student council's records, including meeting minutes, event schedules, and communication with stakeholders.</p>
      </div>
      <div className="message-box" onClick={() => handleClick('Treasurer', 'The Treasurer manages the finances of the student council, including budgeting and expenses tracking...')}>
        <h3>Treasurer</h3>
        <p>The Treasurer manages the finances of the student council, including budgeting, fundraising, and keeping track of expenses.</p>
      </div>
    </div>
  );
};

export default Message;
