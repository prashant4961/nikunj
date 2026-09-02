<?php
session_start();
include 'db.php';

if(isset($_POST['login'])){

    $email = $_POST['email'];
    $password = md5($_POST['password']);

    $sql = "SELECT * FROM users
            WHERE email='$email'
            AND password='$password'";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0){

        $user = mysqli_fetch_assoc($result);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['fullname'];

        echo "<script>
        window.location='index.php?login=success';
      </script>";
    }
    else{

        echo "<script>
                alert('Invalid Email or Password');
              </script>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login - Nikunj Creation</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="login-container">

    <h2>Login</h2>

    <form method="POST">

        <input type="email"
               name="email"
               placeholder="Enter Email"
               required>

        <input type="password"
               name="password"
               placeholder="Enter Password"
               required>

        <button type="submit" name="login">
            Login
        </button>

    </form>

    <br>

    <p>
        Don't have an account?
        <a href="register.php">Register</a>
    </p>

    <br>

    <a href="index.php">← Back to Home</a>

</div>

</body>
</html>