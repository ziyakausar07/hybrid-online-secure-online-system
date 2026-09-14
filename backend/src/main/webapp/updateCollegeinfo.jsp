<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update College Info</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            width: 50%;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        .form-group input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .form-group input[type="submit"] {
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            width: 100%;
        }
        .form-group input[type="submit"]:hover {
            background-color: #45a049;
        }
        .error {
            color: red;
            font-size: 14px;
            text-align: center;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Update College Information</h2>

    <form action="UpdateCollegeInfoServlet" method="post">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required />
        </div>

        <div class="form-group">
            <label for="college_email">College Email</label>
            <input type="email" id="college_email" name="college_email" required />
        </div>

        <div class="form-group">
            <label for="college_name">College Name</label>
            <input type="text" id="college_name" name="college_name" required />
        </div>

        <div class="form-group">
            <label for="branch">Branch</label>
            <input type="text" id="branch" name="branch" required />
        </div>

        <div class="form-group">
            <input type="submit" value="Update Info" />
        </div>

        <div class="error">
            <%-- Error message will be shown here if there are any issues with form submission --%>
            <%= request.getAttribute("error") != null ? request.getAttribute("error") : "" %>
        </div>
    </form>
</div>

</body>
</html>
