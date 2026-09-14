package com.java.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;

import org.json.JSONObject;
import com.java.database.DBConnection;
import org.mindrot.jbcrypt.BCrypt;
import com.java.utils.JWTUtil;  // JWT Utility Class

public class UserAuth extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject requestBody = new JSONObject(sb.toString());

        String username = requestBody.optString("username");
        String email = requestBody.optString("email");
        String password = requestBody.optString("password");

        if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
            response.getWriter().write(new JSONObject().put("success", false).put("error", "All fields are required!").toString());
            return;
        }

        Connection conn = DBConnection.getConnection();
        if (conn == null) {
            response.getWriter().write(new JSONObject().put("success", false).put("error", "Database connection error!").toString());
            return;
        }

        try {
            String query = "SELECT * FROM users_info WHERE username = ? AND email = ?";
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setString(1, username);
            pstmt.setString(2, email);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                String storedHashedPassword = rs.getString("password");
                if (BCrypt.checkpw(password, storedHashedPassword)) {
                    String token = JWTUtil.generateToken(username); // JWT Token Generate

                    JSONObject jsonResponse = new JSONObject();
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Login Successful");
                    jsonResponse.put("token", token);
                    jsonResponse.put("user", new JSONObject().put("username", username).put("role", rs.getString("role")));

                    response.getWriter().write(jsonResponse.toString());
                } else {
                    response.getWriter().write(new JSONObject().put("success", false).put("error", "Incorrect password").toString());
                }
            } else {
                response.getWriter().write(new JSONObject().put("success", false).put("error", "User not found").toString());
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().write(new JSONObject().put("success", false).put("error", "Database query error!").toString());
        } finally {
            DBConnection.closeConnection(conn);
        }
    }
}
