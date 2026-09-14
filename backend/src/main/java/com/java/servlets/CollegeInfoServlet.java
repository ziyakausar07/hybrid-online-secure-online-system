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

public class CollegeInfoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    PrintWriter out = response.getWriter();

    // Get username from the query string
    String username = request.getParameter("username");
    if (username == null || username.isEmpty()) {
        sendErrorResponse(out, "Username is required");
        return;
    }

    try (Connection conn = DBConnection.getConnection()) {
        if (conn == null) {
            sendErrorResponse(out, "Database connection failed");
            return;
        }

        // Fetch the user's role from the database
        String roleQuery = "SELECT role FROM users_info WHERE username = ?";
        PreparedStatement roleStmt = conn.prepareStatement(roleQuery);
        roleStmt.setString(1, username);
        ResultSet roleRs = roleStmt.executeQuery();

        String role = "";
        if (roleRs.next()) {
            role = roleRs.getString("role");
        } else {
            sendErrorResponse(out, "User not found");
            return;
        }

        // If the role is "admin", fetch the basic details
        if (role.equals("admin")) {
            String infoQuery = "SELECT username, college_email, college_name, branch FROM users_info WHERE username = ?";
            PreparedStatement infoStmt = conn.prepareStatement(infoQuery);
            infoStmt.setString(1, username);
            ResultSet rs = infoStmt.executeQuery();

            if (rs.next()) {
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("username", rs.getString("username"));
                jsonResponse.put("college_email", rs.getString("college_email"));
                jsonResponse.put("college_name", rs.getString("college_name"));
                jsonResponse.put("branch", rs.getString("branch"));
                sendSuccessResponse(out, jsonResponse);
            } else {
                sendErrorResponse(out, "No data found");
            }

        // If the role is "voter", fetch additional details like semester, department, and division
        } else if (role.equals("voter")) {
            String infoQuery = "SELECT username, college_email, college_name, branch, semester, department, division FROM users_info WHERE username = ?";
            PreparedStatement infoStmt = conn.prepareStatement(infoQuery);
            infoStmt.setString(1, username);
            ResultSet rs = infoStmt.executeQuery();

            if (rs.next()) {
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("username", rs.getString("username"));
                jsonResponse.put("college_email", rs.getString("college_email"));
                jsonResponse.put("college_name", rs.getString("college_name"));
                jsonResponse.put("branch", rs.getString("branch"));
                jsonResponse.put("semester", rs.getString("semester"));
                jsonResponse.put("department", rs.getString("department"));
                jsonResponse.put("division", rs.getString("division"));
                sendSuccessResponse(out, jsonResponse);
            } else {
                sendErrorResponse(out, "No data found");
            }

        // If the role is neither "admin" nor "voter", return a forbidden error
        } else {
            sendErrorResponse(out, "Unauthorized role");
        }
    } catch (Exception e) {
        e.printStackTrace();
        sendErrorResponse(out, "Internal Server Error");
    }
}
// Helper method for sending error response
private void sendErrorResponse(PrintWriter out, String errorMessage) {
    JSONObject jsonResponse = new JSONObject();
    jsonResponse.put("success", false);
    jsonResponse.put("error", errorMessage);
    out.print(jsonResponse.toString());
    out.flush();
}
// Helper method for sending success response
private void sendSuccessResponse(PrintWriter out, JSONObject jsonResponse) {
    jsonResponse.put("success", true);
    out.print(jsonResponse.toString());
    out.flush();
}


}
