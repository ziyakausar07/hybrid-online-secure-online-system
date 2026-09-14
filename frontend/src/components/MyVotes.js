import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import axios from "axios";
import { MdHowToVote } from "react-icons/md";

const MyVotes = () => {
  const [votes, setVotes] = useState([]);
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
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE_URL}/api/my-votes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setVotes(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load your vote history");
      });
  }, []);

  return (
    <div className="p-8 mt-16 rounded-2xl shadow-xl w-[95%] max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-gray-300">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6 flex items-center justify-center gap-2">
        <MdHowToVote className="text-4xl text-pink-500" /> Your Voting History
      </h2>

      {votes.length > 0 ? (
        <table className="min-w-full text-center border border-gray-300 shadow-md">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="px-4 py-3 border">Election Title</th>
              <th className="px-4 py-3 border">Candidate Voted</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote, index) => (
              <tr key={index} className="hover:bg-indigo-50 transition">
                <td className="px-4 py-3 border">{vote.vote_title}</td>
                <td className="px-4 py-3 border font-semibold text-green-700">
                  {vote.candidate_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600 animate-pulse">
          No votes recorded yet.
        </p>
      )}
    </div>
  );
};

export default MyVotes;
