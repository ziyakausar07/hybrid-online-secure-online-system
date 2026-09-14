package com.java.servlets;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;

public class ReceiveTitleServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // ✅ Request body se JSON data read karna
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            sb.append(line);
        }
        
        // ✅ JSON parsing
        JSONObject json = new JSONObject(sb.toString());
        String title = json.optString("title", "No Title Received");

        // ✅ Response setup
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("message", "Title received successfully");
        jsonResponse.put("title", title);
        
        out.print(jsonResponse.toString());
        out.flush();
    }
}

