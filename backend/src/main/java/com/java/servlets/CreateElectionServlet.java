package com.java.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import com.java.database.DBConnection;

public class CreateElectionServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Connection conn = null;
        PreparedStatement electionStmt = null;
        PreparedStatement candidateStmt = null;
        ResultSet generatedKeys = null;

        try {
            // 🔹 Read JSON Data
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            JSONObject jsonData = new JSONObject(sb.toString());

            // 🔹 Extracting Data
            String title = jsonData.getString("title");
            String description = jsonData.optString("description", "");
            String startDate = jsonData.getString("startDate");
            String endDate = jsonData.getString("endDate");
            int voteDuration = jsonData.getInt("voteDuration");  // ✅ Ensuring it exists
            JSONArray candidatesArray = jsonData.getJSONArray("candidates");

            if (title.isEmpty() || startDate.isEmpty() || endDate.isEmpty() || candidatesArray.length() == 0 || voteDuration <= 0) {
                out.write("{\"success\": false, \"message\": \"All fields are required!\"}");
                out.flush();
                out.close();
                return;
            }

            // 🔹 Database Connection
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); 

            // 🔹 Insert Election with voteDuration
            String electionSQL = "INSERT INTO elections (title, description, start_date, end_date, vote_duration) " +
                                 "VALUES (?, ?, ?, ?, ?)";

            electionStmt = conn.prepareStatement(electionSQL, Statement.RETURN_GENERATED_KEYS);
            electionStmt.setString(1, title);
            electionStmt.setString(2, description);
            electionStmt.setDate(3, Date.valueOf(startDate));
            electionStmt.setDate(4, Date.valueOf(endDate));
            electionStmt.setString(5, voteDuration + " Hours");

            int affectedRows = electionStmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating election failed, no rows affected.");
            }

            // 🔹 Get Generated Election ID
            generatedKeys = electionStmt.getGeneratedKeys();
            int electionId = -1;
            if (generatedKeys.next()) {
                electionId = generatedKeys.getInt(1);  // ✅ Safe conversion
            } else {
                throw new SQLException("Creating election failed, no ID obtained.");
            }

            // 🔹 Insert Candidates (Safe)
            String candidateSQL = "INSERT INTO candidates (election_id, name) VALUES (?, ?)";
            candidateStmt = conn.prepareStatement(candidateSQL);

            for (int i = 0; i < candidatesArray.length(); i++) {
                String candidateName = candidatesArray.optString(i, "").trim();
                if (!candidateName.isEmpty()) {
                    candidateStmt.setInt(1, electionId);
                    candidateStmt.setString(2, candidateName);
                    candidateStmt.addBatch();
                }
            }
            candidateStmt.executeBatch(); 

            // 🔹 Commit Transaction
            conn.commit();
            out.write("{\"success\": true, \"message\": \"Election created successfully!\"}");
            out.flush();

        } catch (Exception e) {
            try {
                if (conn != null) conn.rollback(); 
            } catch (SQLException rollbackEx) {
                rollbackEx.printStackTrace();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"message\": \"Error: " + e.getMessage() + "\"}");
            out.flush();
        } finally {
            try {
                if (generatedKeys != null) generatedKeys.close();
                if (electionStmt != null) electionStmt.close();
                if (candidateStmt != null) candidateStmt.close();
                if (conn != null) conn.close();
                out.close();  // ✅ Close the writer
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
}
