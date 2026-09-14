<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*, java.io.*, javax.servlet.*, javax.servlet.http.*" %>
<!DOCTYPE html>
<html>
<head>
    <title>Change Password</title>
</head>
<body>
    <h2>Change Password</h2>
    <form action="ChangePasswordServlet" method="post">
        <label>Old Password:</label>
        <input type="password" name="oldPassword" required><br>

       <label>New Password:</label>
<input type="password" name="newPassword" required><br>

<label>Confirm Password:</label>
<input type="password" name="confirmPassword" required><br>


        <input type="submit" value="Change Password">
    </form>

    <%-- ✅ Error message show karne ke liye --%>
    <% 
        String errorMessage = (String) request.getAttribute("errorMessage");
        if (errorMessage != null) {
    %>
        <p style="color: red;"><%= errorMessage %></p>
    <% } %>
</body>
</html>
