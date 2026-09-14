package com.java.servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;

import com.java.database.DBConnection;

@WebServlet("/backend/MyVotesServlet")
public class MyVotesServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        JSONArray votesArray = new JSONArray();

        try {
            // 👇 Use DBConnection class to get connection
            conn = DBConnection.getConnection();

            String sql = "SELECT vote_title, candidate_name FROM votes WHERE email = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email);
            rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject vote = new JSONObject();
                vote.put("vote_title", rs.getString("vote_title"));
                vote.put("candidate_name", rs.getString("candidate_name"));
                votesArray.put(vote);
            }

            out.print(votesArray.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Database error occurred.\"}");
        } finally {
            try { if (rs != null) rs.close(); } catch (Exception ignored) {}
            try { if (stmt != null) stmt.close(); } catch (Exception ignored) {}
            try { if (conn != null) conn.close(); } catch (Exception ignored) {}
        }
    }
}
