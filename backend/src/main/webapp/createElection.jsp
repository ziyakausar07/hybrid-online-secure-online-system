<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Create Election</title>
</head>
<body>
    <h2>Create a New Election</h2>
    <form action="CreateElectionServlet" method="post">
        <label for="title">Election Title:</label>
        <input type="text" id="title" name="title" required><br><br>

        <label for="description">Description:</label>
        <textarea id="description" name="description"></textarea><br><br>

        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" name="startDate" required><br><br>

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" name="endDate" required><br><br>

        <input type="submit" value="Create Election">
    </form>
</body>
</html>
