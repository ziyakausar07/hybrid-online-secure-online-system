package com.java.servlets;

import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;
import com.java.database.DBConnection;

public class LiveResultServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try (Connection con = DBConnection.getConnection()) {
            String sql = "SELECT name, vote_title, vote_count " +
                         "FROM ( " +
                         "  SELECT c.name, v.vote_title, COUNT(*) AS vote_count, " +
                         "         RANK() OVER (PARTITION BY v.vote_title ORDER BY COUNT(*) DESC) AS rnk " +
                         "  FROM votes v " +
                         "  JOIN candidates c ON v.candidate_id = c.id " +
                         "  GROUP BY c.name, v.vote_title " +
                         ") " +
                         "WHERE rnk = 1";

            try (PreparedStatement ps = con.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {

                JSONArray results = new JSONArray();

                while (rs.next()) {
                    JSONObject result = new JSONObject();
                    result.put("name", rs.getString("name"));
                    result.put("vote_title", rs.getString("vote_title"));
                    result.put("vote_count", rs.getInt("vote_count"));
                    results.put(result);
                }

                out.print(results.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
