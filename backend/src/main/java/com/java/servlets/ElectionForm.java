package com.java.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import com.java.database.DBConnection;

@WebServlet("/ElectionForm")
public class ElectionForm extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        // ** Read JSON data from request body **
        StringBuilder jsonBuffer = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBuffer.append(line);
            }
        }

        // ** Convert JSON string to object **
        String jsonData = jsonBuffer.toString();
        if (jsonData.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("success", false);
            jsonResponse.put("error", "Empty request body");
            out.print(jsonResponse.toString());
            out.flush();
            return;
        }

        try {
            JSONObject json = new JSONObject(jsonData);
            
            // ** Extracting values from JSON **
            String usn        = json.optString("usn");
            String name       = json.optString("name");
            String email      = json.optString("email");
            String college    = json.optString("college");
            String division   = json.optString("division");
            String department = json.optString("department");
            String branch     = json.optString("branch");
            String semester   = json.optString("semester");
            String position   = json.optString("position");

            // ** Validate if any field is empty **
            if (usn.isEmpty() || name.isEmpty() || email.isEmpty() || college.isEmpty() || 
                division.isEmpty() || department.isEmpty() || branch.isEmpty() || 
                semester.isEmpty() || position.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.put("success", false);
                jsonResponse.put("error", "All fields are required");
                out.print(jsonResponse.toString());
                out.flush();
                return;
            }

            // ** Insert into database **
            try (Connection conn = DBConnection.getConnection()) {
                if (conn == null) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    jsonResponse.put("success", false);
                    jsonResponse.put("error", "Database connection failed!");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                String sql = "INSERT INTO ElectionForm (usn, name, email, college, division, department, branch, semester, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, usn);
                pstmt.setString(2, name);
                pstmt.setString(3, email);
                pstmt.setString(4, college);
                pstmt.setString(5, division);
                pstmt.setString(6, department);
                pstmt.setString(7, branch);
                pstmt.setString(8, semester);
                pstmt.setString(9, position);

                int result = pstmt.executeUpdate();
                if (result > 0) {
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Data saved successfully");
                    response.setStatus(HttpServletResponse.SC_OK);
                } else {
                    jsonResponse.put("success", false);
                    jsonResponse.put("error", "Failed to insert data");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                jsonResponse.put("success", false);
                jsonResponse.put("error", "Database error: " + e.getMessage());
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("success", false);
            jsonResponse.put("error", "Invalid JSON format");
        }

        // ** Send Final JSON Response **
        out.print(jsonResponse.toString());
        out.flush();
        out.close();
    }
}
