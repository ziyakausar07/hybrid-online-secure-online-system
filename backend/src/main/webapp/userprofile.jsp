<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>User Profile</title>
    <script>
        function loadUserProfile() {
            fetch('UserProfile', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById("profile").innerHTML = `<p>${data.error}</p>`;
                } else {
                    document.getElementById("profile").innerHTML = `
                        <p><strong>Username:</strong> ${data.username}</p>
                        <p><strong>Email:</strong> ${data.email}</p>`;
                }
            })
            .catch(error => {
                document.getElementById("profile").innerHTML = "<p>Error loading profile.</p>";
            });
        }
    </script>
</head>
<body onload="loadUserProfile()">
    <h2>User Profile</h2>
    <div id="profile">Loading...</div>
</body>
</html>
