<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
}

$user_id = $_SESSION['user_id'];
?>

<!DOCTYPE html>
<html>
<head>
    <title>My Wishlist</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="cart-container">

    <h1>My Wishlist ❤️</h1>

    <br>

<?php

$query = "SELECT products.*
          FROM wishlist
          INNER JOIN products
          ON wishlist.product_id = products.id
          WHERE wishlist.user_id = '$user_id'";

$result = mysqli_query($conn, $query);

if(mysqli_num_rows($result) > 0){

    while($row = mysqli_fetch_assoc($result)){
?>

    <div class="cart-item">

        <img src="images/<?php echo $row['image']; ?>"
             width="120">

        <h3><?php echo $row['name']; ?></h3>

        <p>₹<?php echo $row['price']; ?></p>

        <p><?php echo $row['description']; ?></p>

        <br>

<a href="remove-wishlist.php?id=<?php echo $row['id']; ?>">
    <button style="
        background:red;
        color:white;
        border:none;
        padding:10px 15px;
        border-radius:5px;
        cursor:pointer;
    ">
        Remove
    </button>
</a>
    </div>

    <hr>

<?php
    }
}
else{
    echo "<h3>No products in wishlist</h3>";
}
?>

<br>

<a href="index.php">
    <button class="checkout-btn">
        Continue Shopping
    </button>
</a>

</div>

</body>
</html>