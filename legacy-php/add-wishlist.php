<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
}

$user_id = $_SESSION['user_id'];
$product_id = $_GET['id'];

$check = mysqli_query($conn,
"SELECT * FROM wishlist
 WHERE user_id='$user_id'
 AND product_id='$product_id'");

if(mysqli_num_rows($check) == 0){

    mysqli_query($conn,
    "INSERT INTO wishlist(user_id, product_id)
     VALUES('$user_id','$product_id')");
}

header("Location: index.php?wishlist=added");
?>

