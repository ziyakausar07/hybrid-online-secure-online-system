<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Vote Page</title>
</head>
<body>
    <h2>Vote for Your Candidate</h2>

    <form action="VotePage" method="post">
        <label for="title">Election Title:</label>
        <input type="text" id="title" name="title" required><br><br>

        <label for="vote_duration">Vote Duration:</label>
        <input type="text" id="vote_duration" name="vote_duration" required><br><br>

        <button type="submit">Submit</button>
    </form>

    <h3>Candidates List</h3>
    <div id="candidates"></div>

    <script>
        document.querySelector("form").onsubmit = async function(event) {
            event.preventDefault();

            let formData = new FormData(event.target);
            let response = await fetch("VotePage", {
                method: "POST",
                body: formData
            });

            let result = await response.json();

            if (result.error) {
                document.getElementById("candidates").innerHTML = "<p style='color: red;'>" + result.error + "</p>";
            } else {
                let candidatesHtml = "<ul>";
                result.candidates.forEach(candidate => {
                    candidatesHtml += `<li><strong>${candidate.name}</strong> (${candidate.title})</li>`;
                });
                candidatesHtml += "</ul>";
                document.getElementById("candidates").innerHTML = candidatesHtml;
            }
        };
    </script>
</body>
</html>
