package com.java.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;

import com.java.database.DBConnection;

public class VerifyOTPServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line);
        }

        String requestBody = stringBuilder.toString();
        JSONObject jsonObject = new JSONObject(requestBody);

        String email = jsonObject.optString("email");
        String enteredOtp = jsonObject.optString("otp");
        int candidateId = jsonObject.optInt("candidate_id");
        String candidateName = jsonObject.optString("candidate_name");
        String voteTitle = jsonObject.optString("vote_title");

        if (email == null || enteredOtp == null || email.isEmpty() || enteredOtp.isEmpty()
                || candidateId == 0 || candidateName.isEmpty() || voteTitle.isEmpty()) {
            out.print("{\"success\": false, \"error\": \"All fields are required\"}");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {

            // ✅ Check vote_end time
            String endTimeQuery = "SELECT vote_end FROM elections WHERE title = ?";
            try (PreparedStatement stmt = conn.prepareStatement(endTimeQuery)) {
                stmt.setString(1, voteTitle);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    Timestamp voteEnd = rs.getTimestamp("vote_end");
                    Timestamp now = new Timestamp(System.currentTimeMillis());
                    if (voteEnd != null && now.after(voteEnd)) {
                        out.print("{\"success\": false, \"error\": \"Voting time is over!\"}");
                        return;
                    }
                }
            }

            // ✅ Check if user already voted
            String checkQuery = "SELECT COUNT(*) FROM votes WHERE email = ? AND vote_title = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkQuery)) {
                checkStmt.setString(1, email);
                checkStmt.setString(2, voteTitle);
                ResultSet rs = checkStmt.executeQuery();
                if (rs.next() && rs.getInt(1) > 0) {
                    out.print("{\"success\": false, \"error\": \"You have already voted!\"}");
                    return;
                }
            }

            // ✅ OTP verification
            String correctOtp = GenerateOTPServlet.getOtp(email);
            if (correctOtp != null && correctOtp.equals(enteredOtp)) {
                GenerateOTPServlet.removeOtp(email); // One-time use
                String insertQuery = "INSERT INTO votes (email, candidate_id, candidate_name, vote_title, vote_time, otp) VALUES (?, ?, ?, ?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(insertQuery)) {
                    stmt.setString(1, email);
                    stmt.setInt(2, candidateId);
                    stmt.setString(3, candidateName);
                    stmt.setString(4, voteTitle);
                    stmt.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
                    stmt.setString(6, enteredOtp);
                    stmt.executeUpdate();
                }

                out.print("{\"success\": true, \"message\": \"OTP verified successfully. Vote recorded!\"}");
            } else {
                out.print("{\"success\": false, \"error\": \"Invalid OTP. Please try again.\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"success\": false, \"error\": \"Error: " + e.getMessage() + "\"}");
        } finally {
            out.close();
        }
    }
}
