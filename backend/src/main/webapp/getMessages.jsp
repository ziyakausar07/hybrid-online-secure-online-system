<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*, com.java.database.DBConnection" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Election Form</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
        form { width: 50%; margin: auto; padding: 10px; background: #f4f4f4; border-radius: 5px; }
        input, button { padding: 10px; margin: 5px; width: 100%; }
        table { width: 80%; margin: auto; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: center; }
        th { background-color: #4CAF50; color: white; }
        .error { color: red; font-weight: bold; }
    </style>
</head>
<body>

    <h2>Election Registration</h2>

    <!-- ✅ Election Form -->
    <form action="GetMessagesServlet" method="post">
        <input type="text" name="title" placeholder="Enter Election Title" required>
        <input type="text" name="vote_duration" placeholder="Enter Vote Duration" required>
        <button type="submit">Submit Election</button>
    </form>

    <h2>Election Messages</h2>

    <%
        try (Connection conn = DBConnection.getConnection()) { 
            String sql = "SELECT DISTINCT title, vote_duration FROM elections"; 
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
    %>

    <table>
        <tr>
            <th>Title</th>
            <th>Vote Duration</th>
        </tr>

        <% while (rs.next()) { %>
            <tr>
                <td><%= rs.getString("title") %></td>
                <td><%= rs.getString("vote_duration") %></td>
            </tr>
        <% } %>
    </table>

    <%
            rs.close();
            stmt.close();
        } catch (Exception e) {
    %>
        <p class="error">⚠ Database Error: <%= e.getMessage() %></p>
    <%
        }
    %>

</body>
</html>
