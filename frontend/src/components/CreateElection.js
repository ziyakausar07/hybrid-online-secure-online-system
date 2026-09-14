import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import axios from "axios";

const CreateElection = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [voteDuration, setVoteDuration] = useState(""); // Add this state for vote duration
    const [candidates, setCandidates] = useState([]);
    const [newCandidate, setNewCandidate] = useState("");

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

    const handleCreateElection = async () => {
        if (!title || !startDate || !endDate || candidates.length === 0 || !voteDuration) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/createElection`, {
                title,
                description,
                startDate,
                endDate,
                voteDuration,  // Send the vote duration to backend
                candidates
            }, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            alert(response.data.message);
        } catch (error) {
            alert("Election creation failed");
            console.error(error);
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
            <h2>Create Election</h2>
            <input type="text" placeholder="Election Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <h3>Voting Duration (in hours)</h3>
            <input type="number" placeholder="Voting Duration (hours)" value={voteDuration} onChange={(e) => setVoteDuration(e.target.value)} />

            <h3> Candidates </h3>
            <input type="text" placeholder="Candidate Name" value={newCandidate} onChange={(e) => setNewCandidate(e.target.value)} />
            <button onClick={() => { setCandidates([...candidates, newCandidate]); setNewCandidate(""); }}>Add Candidate</button>

            <ul>
                {candidates.map((candidate, index) => <li key={index}>{candidate}</li>)}
            </ul>

            <button onClick={handleCreateElection}>Create Election</button>
        </div>
    );
};

export default CreateElection;
