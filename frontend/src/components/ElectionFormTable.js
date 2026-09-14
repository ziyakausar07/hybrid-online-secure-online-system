// React Frontend (ElectionFormTable.js)
import React, { useEffect, useState } from "react";
import { API_BASE_URL, WS_URL } from "../apiConfig";
import "./ElectionFormTable.css";
const ElectionFormTable = () => {
    const [candidates, setCandidates] = useState([]);
useEffect(() => {
    // ✅ Set body background dynamically
    document.body.style.background =
      "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";

    // ✅ Body ko center me lane ke liye flexbox ka use
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";

    return () => {
      // ✅ Reset body background and layout on unmount
      document.body.style.background = "";
      document.body.style.display = "";
      document.body.style.justifyContent = "";
      document.body.style.alignItems = "";
      document.body.style.height = "";
      document.body.style.margin = "";
    };
  }, []);
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/candidates`)
            .then((res) => res.json())
            .then((data) => setCandidates(data))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    return (
        <div>
            <h2>Election Candidates</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USN</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>College</th>
                        <th>Division</th>
                        <th>Department</th>
                        <th>Branch</th>
                        <th>Semester</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <tr key={candidate.ID}>
                            <td>{candidate.ID}</td>
                            <td>{candidate.USN}</td>
                            <td>{candidate.NAME}</td>
                            <td>{candidate.EMAIL}</td>
                            <td>{candidate.COLLEGE}</td>
                            <td>{candidate.DIVISION}</td>
                            <td>{candidate.DEPARTMENT}</td>
                            <td>{candidate.BRANCH}</td>
                            <td>{candidate.SEMESTER}</td>
                            <td>{candidate.POSITION}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ElectionFormTable;
