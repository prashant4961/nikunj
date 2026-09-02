<?php
session_start();
include 'db.php';

if(isset($_POST['login'])){

    $email = $_POST['email'];
    $password = md5($_POST['password']);

    $sql = "SELECT * FROM admin
            WHERE email='$email'
            AND password='$password'";

    $result = mysqli_query($conn,$sql);

    if(mysqli_num_rows($result)>0){

        $_SESSION['admin'] = $email;

        header("Location: admin-dashboard.php");
    }
    else{
        echo "<script>alert('Invalid Admin Login');</script>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Admin Login</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="login-container">

<h2>Admin Login</h2>

<form method="POST">

<input type="email"
name="email"
placeholder="Admin Email"
required>

<input type="password"
name="password"
placeholder="Password"
required>

<button type="submit"
name="login">
Login
</button>

</form>

</div>

</body>
</html>