<%@ page session="true" %>
<!DOCTYPE html>
<html>
<head>
    <title>My Votes</title>
</head>
<body>

<%
    String email = (String) session.getAttribute("email");
    if (email == null) {
%>
    <script>
        alert("Please login first.");
        window.location.href = "login.jsp";
    </script>
<%
    }
%>

<h2>My Votes</h2>

<div id="voteData">Loading...</div>

<script>
    fetch("MyVotesServlet")
        .then(response => response.json())
        .then(data => {
            let content = "";

            if (data.length === 0) {
                content = "<p>No votes found.</p>";
            } else {
                content = "<table border='1'><tr><th>Election</th><th>Candidate</th></tr>";
                data.forEach(vote => {
                    content += "<tr><td>" + vote.vote_title + "</td><td>" + vote.candidate_name + "</td></tr>";
                });
                content += "</table>";
            }

            document.getElementById("voteData").innerHTML = content;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("voteData").innerHTML = "<p>Error fetching votes.</p>";
        });
</script>

</body>
</html>
