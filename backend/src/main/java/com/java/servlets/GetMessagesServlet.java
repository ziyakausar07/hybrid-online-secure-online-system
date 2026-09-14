package com.java.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import com.java.database.DBConnection;

public class GetMessagesServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String title = request.getParameter("title");

        if (title == null || title.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"message\": \"❌ Title parameter is required\"}");
            return;
        }

        List<JSONObject> messages = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT title, vote_duration, COALESCE(expired, 'false') AS expired " +
                         "FROM elections " +
                         "WHERE title = ?";

            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, title);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject message = new JSONObject();

                // Fetch and format the vote_duration
                String voteDuration = rs.getString("vote_duration");  // This will be in format "DD HH24:MI:SS"
                String expiredFlag = rs.getString("expired");
                boolean isExpired = "true".equalsIgnoreCase(expiredFlag);

                // If expired, update DB (if needed)
                if (isExpired) {
                    String checkSql = "SELECT expired FROM elections WHERE title = ?";
                    try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                        checkStmt.setString(1, title);
                        ResultSet checkRs = checkStmt.executeQuery();

                        if (checkRs.next()) {
                            String dbExpired = checkRs.getString("expired");
                            if (!"true".equalsIgnoreCase(dbExpired)) {
                                String updateSql = "UPDATE elections SET expired = 'true' WHERE title = ?";
                                try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                                    updateStmt.setString(1, title);
                                    updateStmt.executeUpdate();
                                    System.out.println("✅ Expired status updated in DB for: " + title);
                                }
                            }
                        }
                        checkRs.close();
                    }
                }

                // Add details to the message JSON
                message.put("title", rs.getString("title"));
                message.put("vote_duration", voteDuration);  // This will return the formatted string
                message.put("expired", isExpired);

                messages.add(message);
            }

            rs.close();
            stmt.close();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\": \"Database error\"}");
            return;
        }

        // Return the list as JSON
        JSONArray jsonArray = new JSONArray(messages);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(jsonArray.toString());
        out.flush();
    }
}
