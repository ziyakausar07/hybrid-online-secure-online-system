<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="yourpackage.Result" %> <!-- Change to your actual package -->
<html>
<head>
    <title>Election Results</title>
</head>
<body style="font-family: Arial; text-align: center; background-color: #f0f0f0; padding: 30px;">
    <h2>🏆 Final Election Results</h2>

    <table border="1" cellpadding="10" cellspacing="0" style="margin: auto; background-color: white;">
        <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Total Votes</th>
        </tr>

        <%
            List<Result> results = (List<Result>) request.getAttribute("results");
            if (results != null && !results.isEmpty()) {
                for (Result r : results) {
        %>
        <tr>
            <td><%= r.getName() %></td>
            <td><%= r.getTitle() %></td>
            <td><%= r.getVoteCount() %></td>
        </tr>
        <%
                }
            } else {
        %>
        <tr>
            <td colspan="3">No results available</td>
        </tr>
        <%
            }
        %>
    </table>
</body>
</html>
