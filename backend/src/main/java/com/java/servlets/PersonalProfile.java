package com.java.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import com.java.database.DBConnection;

public class PersonalProfile extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // 📝 **Request se username lena (Query Parameter se)**
        String username = request.getParameter("username");
        if (username == null || username.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"message\": \"Username is required\"}");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            if (conn == null) {  // DB Connection Check
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Database connection failed\"}");
                return;
            }

            // 🟢 **Username ke basis par User ID fetch karna**
            String userIdQuery = "SELECT id FROM users_info WHERE username = ?";
            PreparedStatement userIdStmt = conn.prepareStatement(userIdQuery);
            userIdStmt.setString(1, username);
            ResultSet userIdResult = userIdStmt.executeQuery();

            if (userIdResult.next()) {
                int userId = userIdResult.getInt("id"); // Fetching userId based on username

                // 🟢 **User Profile fetch karna using userId**
                String profileQuery = "SELECT username, email, phone FROM users_info WHERE id = ?";
                PreparedStatement profileStmt = conn.prepareStatement(profileQuery);
                profileStmt.setInt(1, userId);
                ResultSet rs = profileStmt.executeQuery();

                if (rs.next()) {
                    // Creating JSON object for the user profile
                    JSONObject userJson = new JSONObject();
                    userJson.put("username", rs.getString("username"));
                    userJson.put("email", rs.getString("email"));
                    userJson.put("phone", rs.getString("phone"));

                    // Send response as JSON
                    out.print(userJson.toString());
                } else {
                    // User profile not found for the given userId
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"message\": \"User profile not found\"}");
                }
            } else {
                // Username not found in the database
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"message\": \"User not found\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"message\": \"Error retrieving profile\"}");
            e.printStackTrace();
        }
    }
}
