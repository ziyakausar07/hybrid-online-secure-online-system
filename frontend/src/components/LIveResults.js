import React, { useEffect, useState } from "react";
import { WS_URL } from "../apiConfig";
import "./LiveResults.css"; // ✅ Import the CSS
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const LiveResults = () => {
    const [results, setResults] = useState([]);
useEffect(() => {
    document.body.style.background =
      "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";
    document.body.style.minHeight = "136vh";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
    };
  }, []);
    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            ws.send("getResults");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setResults(data);
            } catch (e) {
                console.error("❌ Failed to parse WebSocket message:", e);
            }
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("⚠️ WebSocket closed");
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="wrapper">
            <div className="live-results-container">
                <h2 className="live-results-heading">📊 Live Election Results</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={results}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="votes" fill="#4caf50" barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
    
};

export default LiveResults;
