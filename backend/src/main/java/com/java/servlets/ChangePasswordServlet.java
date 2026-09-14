package com.java.servlets;

import java.io.BufferedReader;
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
import org.mindrot.jbcrypt.BCrypt;
import com.java.database.DBConnection;

public class ChangePasswordServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        // 🔹 Read JSON Body
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        // 🔹 Parse JSON Request
        JSONObject json = new JSONObject(sb.toString());
        String username = json.optString("username", null);
        String oldPassword = json.optString("oldPassword", null);
        String newPassword = json.optString("newPassword", null);
        String confirmPassword = json.optString("confirmPassword", null);

        // 🔹 Debugging logs
        System.out.println("🔹 Username: " + username);
        System.out.println("🔹 Old Password: " + oldPassword);
        System.out.println("🔹 New Password: " + newPassword);
        System.out.println("🔹 Confirm Password: " + confirmPassword);

        // 🔹 Validation: Check for null values
        if (username == null || oldPassword == null || newPassword == null || confirmPassword == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"error\":\"All fields are required!\"}");
            return;
        }

        // 🔹 Validation: New password and confirm password must match
        if (!newPassword.equals(confirmPassword)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.write("{\"error\":\"New Password and Confirm Password do not match!\"}");
            return;
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        PreparedStatement updateStmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Ensure transaction control

            // 🔹 Get user details from DB
            stmt = conn.prepareStatement("SELECT id, password FROM users_info WHERE username = ?");
            stmt.setString(1, username);
            rs = stmt.executeQuery();

            if (rs.next()) {
                String userId = rs.getString("id");
                String storedPassword = rs.getString("password");

                System.out.println("🔹 User Found: " + userId);

                // 🔹 Check old password
                if (BCrypt.checkpw(oldPassword, storedPassword)) {
                    System.out.println("✅ Old Password Matched");

                    // 🔹 Hash new password
                    String hashedNewPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());

                    // 🔹 Update password in DB
                    updateStmt = conn.prepareStatement("UPDATE users_info SET password = ? WHERE id = ?");
                    updateStmt.setString(1, hashedNewPassword);
                    updateStmt.setString(2, userId);

                    int rowsUpdated = updateStmt.executeUpdate();
                    
                    if (rowsUpdated > 0) {
                        conn.commit();
                        System.out.println("✅ Password Updated Successfully");
                        response.setStatus(HttpServletResponse.SC_OK);
                        out.write("{\"message\":\"Password updated successfully!\"}");
                    } else {
                        conn.rollback();
                        System.out.println("❌ Password Update Failed");
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        out.write("{\"error\":\"Password update failed!\"}");
                    }
                } else {
                    System.out.println("❌ Incorrect Old Password");
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.write("{\"error\":\"Incorrect old password!\"}");
                }
            } else {
                System.out.println("❌ User Not Found");
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.write("{\"error\":\"User not found!\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"error\":\"Internal Server Error!\"}");
        } finally {
            try { if (rs != null) rs.close(); } catch (Exception e) { e.printStackTrace(); }
            try { if (stmt != null) stmt.close(); } catch (Exception e) { e.printStackTrace(); }
            try { if (updateStmt != null) updateStmt.close(); } catch (Exception e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (Exception e) { e.printStackTrace(); }
        }
    }
}
