```php
<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

if(isset($_POST['change'])){

    $old_password = md5($_POST['old_password']);
    $new_password = md5($_POST['new_password']);
    $confirm_password = md5($_POST['confirm_password']);

    $check = mysqli_query($conn,
    "SELECT * FROM users
    WHERE id='$user_id'
    AND password='$old_password'");

    if(mysqli_num_rows($check)==0){

        header("Location: change-password.php?error=old");
        exit();

    }

    if($new_password != $confirm_password){

        header("Location: change-password.php?error=match");
        exit();

    }

    mysqli_query($conn,
    "UPDATE users
    SET password='$new_password'
    WHERE id='$user_id'");

    header("Location: profile.php?password=changed");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>

<title>Change Password</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

<?php
if(isset($_GET['error'])){

if($_GET['error']=="old"){
?>
<div class="toast-message" style="background:#e53935;">
❌ Old Password Incorrect
</div>
<?php
}

if($_GET['error']=="match"){
?>
<div class="toast-message" style="background:#ff9800;">
⚠ New Password and Confirm Password do not match
</div>
<?php
}
}
?>

<div class="login-container">

<h2>Change Password</h2>

<form method="POST">

<input
type="password"
name="old_password"
placeholder="Old Password"
required>

<input
type="password"
name="new_password"
placeholder="New Password"
required>

<input
type="password"
name="confirm_password"
placeholder="Confirm New Password"
required>

<button
type="submit"
name="change">

Change Password

</button>

</form>

<br>

<a href="profile.php">
<button type="button">
Back
</button>
</a>

</div>

</body>
</html>
```
