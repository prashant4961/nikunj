<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

$result = mysqli_query($conn,"SELECT * FROM users WHERE id='$user_id'");
$user = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html>
<head>
    <title>My Profile</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php
if(isset($_GET['updated'])){
?>
<div class="toast-message">
    ✅ Profile Updated Successfully
</div>
<?php
}
?>
<?php
if(isset($_GET['password'])){
?>
<div class="toast-message">
✅ Password Changed Successfully
</div>
<?php
}
?>
<div class="cart-container">

    <h1 align="center">👤 My Profile</h1>

    <br>

    <table class="orders-table">

        <tr>
            <th>Full Name</th>
            <td><?php echo $user['fullname']; ?></td>
        </tr>

        <tr>
            <th>Email</th>
            <td><?php echo $user['email']; ?></td>
        </tr>

        <tr>
            <th>Phone</th>
            <td><?php echo $user['phone']; ?></td>
        </tr>

        <tr>
            <th>Account Created</th>
            <td><?php echo $user['created_at']; ?></td>
        </tr>

    </table>

    <br><br>

    <center>

        <a href="edit-profile.php">
            <button>Edit Profile</button>
        </a>

        &nbsp;

        <a href="change-password.php">
            <button>Change Password</button>
        </a>

        &nbsp;

        <a href="orders.php">
            <button>My Orders</button>
        </a>

        <br><br>

        <a href="wishlist.php">
            <button>Wishlist</button>
        </a>

        &nbsp;

        <a href="logout.php">
            <button>Logout</button>
        </a>

        &nbsp;

        <a href="index.php">
            <button>Back Home</button>
        </a>

    </center>

</div>

</body>
</html>