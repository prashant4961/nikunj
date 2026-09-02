<?php
include 'db.php';

if(isset($_POST['register'])){

    $fullname = $_POST['fullname'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];

    $password = md5($password);

    $sql = "INSERT INTO users(fullname,email,phone,password)
            VALUES('$fullname','$email','$phone','$password')";

    if(mysqli_query($conn, $sql)){
        echo "<script>
                alert('Registration Successful');
                window.location='login.php';
              </script>";
    }
    else{
        echo "Error: " . mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="login-container">

    <h2>Create Account</h2>

    <form method="POST">

        <input type="text" name="fullname"
        placeholder="Enter Full Name" required>

        <input type="email" name="email"
        placeholder="Enter Email" required>

        <input type="text" name="phone"
        placeholder="Enter Mobile Number" required>

        <input type="password" name="password"
        placeholder="Create Password" required>

        <button type="submit" name="register">
            Register
        </button>

    </form>

    <br>

    <a href="login.php">Already have account? Login</a>

</div>

</body>
</html>