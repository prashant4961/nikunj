```php
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

if(isset($_POST['update'])){

    $fullname = mysqli_real_escape_string($conn,$_POST['fullname']);
    $email = mysqli_real_escape_string($conn,$_POST['email']);
    $phone = mysqli_real_escape_string($conn,$_POST['phone']);

    mysqli_query($conn,"
    UPDATE users SET
    fullname='$fullname',
    email='$email',
    phone='$phone'
    WHERE id='$user_id'
    ");

    $_SESSION['user_name'] = $fullname;

    header("Location: profile.php?updated=1");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Profile</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="login-container">

<h2>Edit Profile</h2>

<form method="POST">

<input
type="text"
name="fullname"
value="<?php echo htmlspecialchars($user['fullname']); ?>"
placeholder="Full Name"
required>

<input
type="email"
name="email"
value="<?php echo htmlspecialchars($user['email']); ?>"
placeholder="Email"
required>

<input
type="text"
name="phone"
value="<?php echo htmlspecialchars($user['phone']); ?>"
placeholder="Phone Number"
required>

<br><br>

<button
type="submit"
name="update">
Update Profile
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
