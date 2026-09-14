package com.java.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.json.JSONArray;
import org.json.JSONObject;

import com.java.database.DBConnection;

public class VotePage extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {
            // ✅ JSON body parse karna
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JSONObject jsonData = new JSONObject(sb.toString());

            // ✅ Ensure title exists
            if (!jsonData.has("title")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\":\"Title field is missing in request\"}");
                return;
            }

            // ✅ Request parameters lena
            String title = jsonData.getString("title").trim(); 
            String voteDuration = jsonData.optString("vote_duration", "").trim();

            // ✅ Validation
            if (title.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\":\"Title cannot be empty\"}");
                return;
            }

            boolean hasVoteDuration = !voteDuration.isEmpty();

            // ✅ SQL Query Fix
            String sql = "SELECT c.id, c.name, e.title FROM candidates c " +
                         "JOIN elections e ON c.election_id = e.id " +
                         "WHERE e.title = ? " +
                         (hasVoteDuration ? "AND e.vote_duration = ?" : "");

            try (PreparedStatement pstmt = con.prepareStatement(sql)) {
                pstmt.setString(1, title);
                if (hasVoteDuration) {
                    pstmt.setString(2, voteDuration);
                }

                ResultSet rs = pstmt.executeQuery();
                JSONArray candidatesArray = new JSONArray();

                while (rs.next()) {
                    JSONObject candidate = new JSONObject();
                    candidate.put("id", rs.getInt("id"));
                    candidate.put("name", rs.getString("name"));
                    candidate.put("title", rs.getString("title"));
                    candidatesArray.put(candidate);
                }

                JSONObject result = new JSONObject();
                result.put("candidates", candidatesArray);
                out.print(result);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Error fetching candidates based on election details\"}");
            e.printStackTrace();
        }
    }
}
