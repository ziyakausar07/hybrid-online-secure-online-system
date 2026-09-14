package com.java.servlets;


import com.java.database.DBConnection;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ElectionFormTable extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try (Connection conn = DBConnection.getConnection()) {
            String query = "SELECT * FROM ElectionForm";
            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {

                JSONArray jsonArray = new JSONArray();
                while (rs.next()) {
                    JSONObject obj = new JSONObject();
                    obj.put("ID", rs.getInt("ID"));
                    obj.put("USN", rs.getString("USN"));
                    obj.put("NAME", rs.getString("NAME"));
                    obj.put("EMAIL", rs.getString("EMAIL"));
                    obj.put("COLLEGE", rs.getString("COLLEGE"));
                    obj.put("DIVISION", rs.getString("DIVISION"));
                    obj.put("DEPARTMENT", rs.getString("DEPARTMENT"));
                    obj.put("BRANCH", rs.getString("BRANCH"));
                    obj.put("SEMESTER", rs.getInt("SEMESTER"));
                    obj.put("POSITION", rs.getString("POSITION"));
                    jsonArray.put(obj);
                }
                out.print(jsonArray.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Database Error\"}");
        }
    }

    
}
