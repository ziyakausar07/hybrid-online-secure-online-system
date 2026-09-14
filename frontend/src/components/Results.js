import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import axios from "axios";
import { FaCrown } from "react-icons/fa"; // 👑 Crown Icon for Winner

const Result = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    document.body.style.background =
      "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)";
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
      document.body.style.display = "";
      document.body.style.justifyContent = "";
      document.body.style.alignItems = "";
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE_URL}/api/result`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Unable to fetch result");
      });
  }, []);

  return (
    <div className="p-8 mt-20 rounded-3xl shadow-2xl w-[95%] max-w-4xl mx-auto bg-white/60 backdrop-blur-lg border border-gray-300 transition-all duration-300">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-green-700 drop-shadow tracking-wide flex justify-center items-center gap-3">
        <FaCrown className="text-yellow-500 animate-pulse" /> Final Result
      </h2>

      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center text-gray-800 shadow-inner rounded-lg">
            <thead className="bg-gradient-to-r from-green-200 to-green-100 text-green-900 font-semibold">
              <tr>
                <th className="px-6 py-3 border border-gray-300">Name</th>
                <th className="px-6 py-3 border border-gray-300">Title</th>
                <th className="px-6 py-3 border border-gray-300">Total Votes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={index}
                  className="hover:bg-green-50 transition duration-300"
                >
                  <td className="px-6 py-4 border border-gray-200 font-medium">
                    {result.name}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 capitalize">
                    {result.vote_title}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 text-lg font-bold text-green-700">
                    {result.vote_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg animate-pulse">
          Loading result...
        </p>
      )}
    </div>
  );
};

export default Result;
