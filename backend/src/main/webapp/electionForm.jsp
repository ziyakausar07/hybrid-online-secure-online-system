<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Election Participation Form</title>
</head>
<body>
    <h2>Election Participation Form</h2>

    <form action="ElectionForm" method="post">
        USN: <input type="text" name="usn" required><br>
        Name: <input type="text" name="name" required><br>
        Email: <input type="email" name="email" required><br>
        College: <input type="text" name="college" required><br>
        Division: <input type="text" name="division" required><br>
        Department: <input type="text" name="department" required><br>
        Branch: <input type="text" name="branch" required><br>
        Semester: <input type="text" name="semester" required><br>
        Position: 
        <select name="position" required>
            <option value="">Select Position</option>
            <option value="Class Representative">Class Representative</option>
            <option value="Ladies Representative">Ladies Representative</option>
            <option value="President">President</option>
            <option value="Vice President">Vice President</option>
            <option value="Secretary">Secretary</option>
            <option value="Treasurer">Treasurer</option>
        </select><br>
        <button type="submit">Submit</button>
    </form>

    <% if (request.getAttribute("errorMessage") != null) { %>
        <p style="color:red;"><%= request.getAttribute("errorMessage") %></p>
    <% } %>

    <% if (request.getAttribute("message") != null) { %>
        <p style="color:green;"><%= request.getAttribute("message") %></p>
    <% } %>
</body>
</html>
