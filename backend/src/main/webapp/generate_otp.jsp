<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Generate OTP</title>
</head>
<body>
    <h2>Generate OTP for Voting</h2>
    
    <form action="GenerateOTPServlet" method="post">
        <label>Email:</label>
        <input type="email" name="email" required>
        <br><br>
        <button type="submit">Generate OTP</button>
    </form>
</body>
</html>
