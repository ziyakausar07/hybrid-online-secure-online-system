package com.java.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;
import org.json.JSONObject;
import com.java.database.DBConnection;

public class RegisterUser extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        // Read JSON body
        StringBuilder sb = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        JSONObject jsonData = new JSONObject(sb.toString());

        // Extract data from JSON
        String usn = jsonData.optString("usn", null);
        String username = jsonData.optString("username", null);
        String email = jsonData.optString("email", null);
        String password = jsonData.optString("password", null);
        String role = jsonData.optString("role", null);

        // Validation
        if (username == null || email == null || password == null || role == null ||
            username.isEmpty() || email.isEmpty() || password.isEmpty() || role.isEmpty()) {
            sendErrorResponse(out, "All fields are required!");
            return;
        }

        if (!role.equalsIgnoreCase("admin") && !role.equalsIgnoreCase("voter")) {
            sendErrorResponse(out, "Invalid role! Must be 'admin' or 'voter'.");
            return;
        }

        if (role.equalsIgnoreCase("admin")) {
            usn = null;
        } else if (usn == null || usn.isEmpty()) {
            sendErrorResponse(out, "USN is required for voters!");
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            // Check if username or email already exists
            String checkQuery = "SELECT COUNT(*) FROM users_info WHERE username = ? OR email = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkQuery)) {
                checkStmt.setString(1, username);
                checkStmt.setString(2, email);
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next() && rs.getInt(1) > 0) {
                        sendErrorResponse(out, "Username or Email already exists!");
                        return;
                    }
                }
            }

            // Hash the password using BCrypt
            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(10));

            // Insert the user into the database
            String insertQuery = "INSERT INTO users_info (usn, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement pst = conn.prepareStatement(insertQuery)) {
                if (usn == null) {
                    pst.setNull(1, java.sql.Types.VARCHAR);
                } else {
                    pst.setString(1, usn);
                }
                pst.setString(2, username);
                pst.setString(3, email);
                pst.setString(4, hashedPassword);
                pst.setString(5, role);

                int rows = pst.executeUpdate();
                if (rows > 0) {
                    sendSuccessResponse(out, "User Registered Successfully!");
                } else {
                    sendErrorResponse(out, "Registration Failed!");
                }
            }
        } catch (SQLException e) {
            sendErrorResponse(out, "Database Error: " + e.getMessage());
        }
    }

    private void sendSuccessResponse(PrintWriter out, String message) {
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("success", true);
        jsonResponse.put("message", message);
        out.print(jsonResponse.toString());
        out.flush();
    }

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Sends an error response as a JSON object with a success flag set to false
 * and an error message.
 *
 * @param out           the PrintWriter to write the JSON response to
 * @param errorMessage  the error message to include in the response
 */

/******  1991ed53-21c9-4fff-894f-a88cc5a60664  *******/
    private void sendErrorResponse(PrintWriter out, String errorMessage) {
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("success", false);
        jsonResponse.put("error", errorMessage);
        out.print(jsonResponse.toString());
        out.flush();
    }
}
