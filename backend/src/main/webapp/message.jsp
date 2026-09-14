<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.io.*" %>
<%@ page import="javax.servlet.*" %>
<%@ page import="javax.servlet.http.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="com.java.database.DBConnection" %>

<html>
<head>
    <title>Election Status</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .status-box {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-top: 20px;
            max-width: 600px;
        }
        .match {
            background-color: #f0f8ff;
        }
        .no-match {
            background-color: #fff3cd;
        }
        .count {
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>

<%
    // Fetch the 'title' parameter passed from the request (e.g., from Node.js backend)
    String titleParam = request.getParameter("title");

    if (titleParam != null && !titleParam.isEmpty()) {
        // Fetch the matching titles count from the database using your existing logic
        int matchCount = 0;
        String message = "";

        // SQL query to check matching titles (based on your servlet code)
        String query = "SELECT COUNT(*) FROM elections WHERE TITLE = ?";
        try (Connection connection = DBConnection.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {

            stmt.setString(1, titleParam);  // Set the title parameter dynamically
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    matchCount = rs.getInt(1);  // Get the count of matching titles
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        if (matchCount > 0) {
            message = "Title matched: " + matchCount;
        } else {
            message = "No matching title found";
        }

%>

    <!-- Display the message and count -->
    <div class="status-box <%= matchCount > 0 ? "match" : "no-match" %>">
        <p><%= message %></p>
        <p class="count">Match Count: <%= matchCount %></p>
    </div>

<%
    } else {
%>
    <!-- If title parameter is missing -->
    <div class="status-box no-match">
        <p>No title parameter provided.</p>
    </div>
<%
    }
%>

</body>
</html>
