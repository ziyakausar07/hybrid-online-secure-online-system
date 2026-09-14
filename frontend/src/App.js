import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import './App.css';
import Register from "./components/Register";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import CollegeInfo from "./components/CollegeInfo"; 
import ElectionFormTable from "./components/ElectionFormTable";
import ChangePassword from "./components/ChangePassword";
import CreateElection from "./components/CreateElection";
import PersonalProfile from "./components/PersonalProfile"; 
import ElectionForm from "./components/ElectionForm";
import CreatedElections from "./components/CreatedElections";
import Message from "./components/Message"; 
import LiveResults from "./components/LIveResults";
import ElectionVoting from "./components/ElectionVoting"; 
import MessageDetail from "./components/MessageDetails";
import Results from "./components/Results";
import UserProfile from "./components/UserProfile"; 
import MyVotes from "./components/MyVotes";
import votingImage from "./assets/vote.jpg";

function Navigation() {
  const location = useLocation();
  return (
    location.pathname === "/" && (
      <nav className="absolute top-5 right-5">
        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md mx-2 hover:bg-blue-700 transition">
          Register
        </Link>
        <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-md mx-2 hover:bg-green-700 transition">
          Login
        </Link>
      </nav>
    )
  );
}

function HomePage() {
  return (
    <><div className="background-color">
      {/* Background sirf home page ke liye */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${votingImage})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      ></motion.div>

      <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
        <Navigation />
        <div className="welcome-text">
          <h1 className="text-5xl font-extrabold text-yellow-400">
            Welcome to Online Voting System
          </h1>
          <p className="text-lg italic mt-3 text-gray-300">
            "Every vote counts. Every voice matters. Secure, Transparent, and Trusted Elections."
          </p>
        </div>
      </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* ✅ Home Page Ke Liye */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/collegeInfo" element={<CollegeInfo />} />
        <Route path="/register-candidate" element={<ElectionForm />} />
        <Route path="/PersonalProfile" element={<PersonalProfile />} />
        <Route path="/create-election" element={<CreateElection />} />
        <Route path="/vote" element={<ElectionVoting />} />
        <Route path="/message" element={<Message />} />
        <Route path="/live-results" element={<LiveResults />} />
        <Route path="/message-detail" element={<MessageDetail />} />
        <Route path="/createdElections" element={<CreatedElections />} />
        <Route path="/applied-students" element={<ElectionFormTable />} />
        <Route path="/myVotes" element={<MyVotes />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
