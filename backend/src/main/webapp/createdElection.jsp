<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Created Elections</title>
</head>
<body>

    <h2>Your Created Elections</h2>

    <form>
        <table border="1">
            <thead>
                <tr>
                    <th>Election Title</th>
                    <th>Election Date</th>
                </tr>
            </thead>
            <tbody id="electionTableBody">
                <!-- Elections will be populated here -->
            </tbody>
        </table>
    </form>

    <script>
        window.onload = function () {
            fetch('http://localhost:7070/backend/createdElections') // Update with your servlet URL
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById("electionTableBody");
                    if (data.length > 0) {
                        data.forEach(election => {
                            const row = `<tr><td>${election.title}</td><td>${election.start_date}</td></tr>`;
                            tableBody.innerHTML += row;
                        });
                    } else {
                        tableBody.innerHTML = '<tr><td colspan="2">No elections created yet.</td></tr>';
                    }
                })
                .catch(err => console.log('Error:', err));
        }
    </script>

</body>
</html>
