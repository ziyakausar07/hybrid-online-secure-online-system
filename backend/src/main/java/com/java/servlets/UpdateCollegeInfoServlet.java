package com.java.servlets;

import com.java.database.DBConnection;
import org.json.JSONObject;

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

public class UpdateCollegeInfoServlet extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        // Read JSON Data from Request Body
        StringBuilder sb = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        // Parse JSON Object
        JSONObject jsonData = new JSONObject(sb.toString());

        String username = jsonData.optString("username", null);
        String college_email = jsonData.optString("college_email", null);
        String college_name = jsonData.optString("college_name", null);
        String branch = jsonData.optString("branch", null);
        String department = jsonData.optString("department", null);
        String division = jsonData.optString("division", null);
        
        // Convert semester to Integer safely
        Integer semesterNumber = null;
        String semesterStr = jsonData.optString("semester", null);
        if (semesterStr != null && !semesterStr.trim().isEmpty()) {
            try {
                semesterNumber = Integer.parseInt(semesterStr.trim());
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\": \"Invalid semester format. It must be a number.\"}");
                return;
            }
        }

        try (Connection conn = DBConnection.getConnection()) {
            // Fetch user role from database
            String roleQuery = "SELECT role FROM users_info WHERE username = ?";
            try (PreparedStatement roleStmt = conn.prepareStatement(roleQuery)) {
                roleStmt.setString(1, username);
                try (ResultSet roleRs = roleStmt.executeQuery()) {

                    if (!roleRs.next()) {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        out.print("{\"error\": \"User not found\"}");
                        return;
                    }

                    String role = roleRs.getString("role");

                    // Validate role & Prepare update query
                    String updateQuery;
                    PreparedStatement stmt;

                    if ("voter".equals(role)) {
                        updateQuery = "UPDATE users_info SET college_email=?, college_name=?, branch=?, semester=?, department=?, division=? WHERE username=?";
                        stmt = conn.prepareStatement(updateQuery);
                        stmt.setString(1, college_email);
                        stmt.setString(2, college_name);
                        stmt.setString(3, branch);
                        stmt.setInt(4, semesterNumber);
                        stmt.setString(5, department);
                        stmt.setString(6, division);
                        stmt.setString(7, username);
                    } 
                    else if ("admin".equals(role)) {
                        updateQuery = "UPDATE users_info SET college_email=?, college_name=?, branch=? WHERE username=?";
                        stmt = conn.prepareStatement(updateQuery);
                        stmt.setString(1, college_email);
                        stmt.setString(2, college_name);
                        stmt.setString(3, branch);
                        stmt.setString(4, username);
                    } 
                    else {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        out.print("{\"error\": \"Unauthorized role\"}");
                        return;
                    }

                    int rowsUpdated = stmt.executeUpdate();
                    if (rowsUpdated > 0) {
                        response.setStatus(HttpServletResponse.SC_OK);
                        out.print("{\"success\": true, \"message\": \"College info updated successfully\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        out.print("{\"error\": \"User not found\"}");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Internal Server Error\"}");
        }
    }
}
