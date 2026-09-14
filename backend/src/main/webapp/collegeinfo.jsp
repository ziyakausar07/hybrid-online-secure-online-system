<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>College Information</title>
    <script>
        function loadCollegeInfo() {
            fetch('CollegeInfoServlet', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById("collegeInfo").innerHTML = `<p>${data.error}</p>`;
                } else {
                    document.getElementById("collegeInfo").innerHTML = `
                        <p><strong>Username:</strong> ${data.username}</p>
                        <p><strong>College Email:</strong> ${data.college_email}</p>
                        <p><strong>College Name:</strong> ${data.college_name}</p>
                        <p><strong>Branch:</strong> ${data.branch}</p>
                        <p><strong>Semester:</strong> ${data.semester}</p>
                        <p><strong>Department:</strong> ${data.department}</p>
                        <p><strong>Division:</strong> ${data.division}</p>`;
                }
            })
            .catch(error => {
                document.getElementById("collegeInfo").innerHTML = "<p>Error loading college information.</p>";
            });
        }
    </script>
</head>
<body onload="loadCollegeInfo()">
    <h2>College Information</h2>
    <div id="collegeInfo">Loading...</div>
</body>
</html>
