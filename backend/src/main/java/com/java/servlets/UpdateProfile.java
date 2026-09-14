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
import com.java.database.DBConnection;
import org.json.JSONObject;

public class UpdateProfile extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Updated part of the UpdateProfile servlet
protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    PrintWriter out = response.getWriter();
    
    // 📝 **Request Body Parse Karna**
    StringBuilder sb = new StringBuilder();
    String line;
    while ((line = request.getReader().readLine()) != null) {
        sb.append(line);
    }
    JSONObject jsonData = new JSONObject(sb.toString());

    // 🛑 **Request se data lena**
    String username, email, phone;
    try {
        username = jsonData.getString("username");  // **Username**
        email = jsonData.getString("email");
        phone = jsonData.getString("phone");
    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("{\"message\": \"Invalid or missing fields\"}");
        return;
    }

    // 🛑 **Validation Check**
    if (username.isEmpty() || email.isEmpty() || phone.isEmpty()) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("{\"message\": \"All fields are required\"}");
        return;
    }

    if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("{\"message\": \"Invalid email format\"}");
        return;
    }

    // 🔄 **Database Update Logic**
    try (Connection conn = DBConnection.getConnection()) {
        if (conn == null) {
            response.getWriter().write(new JSONObject().put("success", false).put("error", "Database connection error!").toString());
            return;
        }

        // **Step 1: Get userId based on username (from token or session)**
        String getUserIdSql = "SELECT id, username FROM users_info WHERE username = ?";
        PreparedStatement getUserIdStmt = conn.prepareStatement(getUserIdSql);
        getUserIdStmt.setString(1, username);  // Use username from token/session here
        ResultSet rs = getUserIdStmt.executeQuery();

        if (!rs.next()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"message\": \"User not found\"}");
            return;
        }

        String userId = rs.getString("id");
        String currentUsername = rs.getString("username");

        // **Step 2: If the username is different, check if the new username already exists**
        if (!username.equals(currentUsername)) {
            String checkUsernameSql = "SELECT id FROM users_info WHERE username = ?";
            PreparedStatement checkUsernameStmt = conn.prepareStatement(checkUsernameSql);
            checkUsernameStmt.setString(1, username);
            ResultSet checkRs = checkUsernameStmt.executeQuery();
            if (checkRs.next()) {
                response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
                out.print("{\"message\": \"Username already exists\"}");
                return;
            }
        }

        // **Step 3: Update the user details (including username, email, and phone)**
        String updateSql = "UPDATE users_info SET username = ?, email = ?, phone = ? WHERE id = ?";
        PreparedStatement updateStmt = conn.prepareStatement(updateSql);
        updateStmt.setString(1, username);
        updateStmt.setString(2, email);
        updateStmt.setString(3, phone);
        updateStmt.setString(4, userId);

        int updatedRows = updateStmt.executeUpdate();
        if (updatedRows > 0) {
            response.setStatus(HttpServletResponse.SC_OK);
            out.print("{\"message\": \"Profile updated successfully\"}");
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"message\": \"Update failed\"}");
        }
    } catch (Exception e) {
        e.printStackTrace();  // Log full stack trace
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"message\": \"Error updating profile\"}");
    }
}

}
