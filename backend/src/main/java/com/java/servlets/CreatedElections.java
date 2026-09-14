package com.java.servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;
import com.java.database.DBConnection;

public class CreatedElections extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        JSONArray electionsArray = new JSONArray();

        try {
            // Get DB connection using DBConnection utility class
            conn = DBConnection.getConnection();

            // Query to fetch all elections (without creator_email filter)
            String sql = "SELECT ID, TITLE, START_DATE FROM elections"; // Changed for simplicity
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject election = new JSONObject();
                election.put("id", rs.getInt("ID"));
                election.put("title", rs.getString("TITLE"));

                // Convert timestamp to string (ISO 8601 format)
                Timestamp timestamp = rs.getTimestamp("START_DATE");
                String formattedDate = timestamp != null ? timestamp.toString() : "";
                election.put("start_date", formattedDate);

                electionsArray.put(election);
            }

            out.print(electionsArray.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Database error occurred.\"}");
        } finally {
            try {
                if (rs != null) rs.close();
            } catch (SQLException ignored) {}
            try {
                if (stmt != null) stmt.close();
            } catch (SQLException ignored) {}
            // Close the connection using the utility method from DBConnection
            DBConnection.closeConnection(conn);
        }
    }
}
