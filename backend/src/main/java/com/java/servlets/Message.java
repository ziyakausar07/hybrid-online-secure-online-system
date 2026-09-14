// Java Servlet (Message.java)
package com.java.servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;
import com.java.database.DBConnection;

public class Message extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        int matchCount = 0;
        String errorMessage = null;

        try {
            matchCount = getMatchingTitlesFromDatabase();
        } catch (Exception e) {
            e.printStackTrace();
            errorMessage = "Database error: " + e.getMessage();
        }

        if (errorMessage != null) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"" + errorMessage + "\"}");
        } else {
            response.getWriter().write("{\"message\":\"Election Data Fetched\", \"matchCount\": " + matchCount + "}");
        }
    }

    private int getMatchingTitlesFromDatabase() throws SQLException {
        int matchCount = 0;
        String query = "SELECT COUNT(*) FROM elections";
        try (Connection connection = DBConnection.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                matchCount = rs.getInt(1);
            }
        }
        return matchCount;
    }
}
