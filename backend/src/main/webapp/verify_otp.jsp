<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Verify OTP</title>
</head>
<body>
    <h2>Verify OTP</h2>
    
    <form action="VerifyOTPServlet" method="post">
        <label>Candidate ID:</label>
        <input type="text" name="candidateId" required>
        <br><br>
        <label>Enter OTP:</label>
        <input type="text" name="otp" required>
        <br><br>
        <button type="submit">Verify OTP</button>
    </form>
</body>
</html>
