<%@ page import="java.sql.*" %>\n<%@ page import="com.java.database.DBConnection" %>
<html>
<head>
    <title>Election Data</title>
</head>
<body>
    <h2>Election Candidates</h2>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Party</th>
        </tr>
        <%
            try {
                Class.forName("oracle.jdbc.driver.OracleDriver");
                Connection con = DBConnection.getConnection();
                Statement stmt = con.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT id, name, party FROM ElectionFormTable");

                while (rs.next()) {
        %>
        <tr>
            <td><%= rs.getInt("id") %></td>
            <td><%= rs.getString("name") %></td>
            <td><%= rs.getString("party") %></td>
        </tr>
        <%
                }
                rs.close();
                stmt.close();
                con.close();
            } catch (Exception e) {
                out.println("Error: " + e.getMessage());
            }
        %>
    </table>
</body>
</html>
