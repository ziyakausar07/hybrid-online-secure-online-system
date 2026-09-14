<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Personal Profile</title>
    <script>
        function loadProfile() {
            fetch('PersonalProfile', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    document.getElementById("profile").innerHTML = `<p>${data.message}</p>`;
                } else {
                    document.getElementById("profile").innerHTML = `
                        <p><strong>Username:</strong> ${data.username}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Phone:</strong> ${data.phone}</p>`;
                }
            })
            .catch(error => {
                document.getElementById("profile").innerHTML = "<p>Error loading profile.</p>";
            });
        }
    </script>
</head>
<body onload="loadProfile()">
    <h2>Personal Profile</h2>
    <div id="profile">Loading...</div>
</body>
</html>
