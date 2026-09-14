<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>\n<%@ page import="com.java.database.DBConnection" %>
<!DOCTYPE html>
<html>
<head>
    <title>Election Voting System</title>
</head>
<body>
    <h1>Election Voting System</h1>
    
    <form action="VoteServlet" method="post">
        <h3>Select a Candidate to Vote</h3>
        <%
            try {
                Class.forName("oracle.jdbc.driver.OracleDriver");
                Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement("SELECT id, name, title FROM candidates");
                ResultSet rs = ps.executeQuery();
                
                while (rs.next()) {
        %>
                    <input type="radio" name="candidateId" value="<%= rs.getInt("id") %>">
                    <%= rs.getString("name") %> - <%= rs.getString("title") %><br>
        <%
                }
                con.close();
            } catch (Exception e) {
                out.println("<p>Error fetching candidates!</p>");
                e.printStackTrace();
            }
        %>
        <br>
        <button type="submit">Vote</button>
    </form>
</body>
</html>
