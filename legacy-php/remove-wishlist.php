<?php
session_start();
include 'db.php';

if(isset($_GET['id'])){

    $product_id = $_GET['id'];
    $user_id = $_SESSION['user_id'];

    mysqli_query($conn,
    "DELETE FROM wishlist
     WHERE product_id='$product_id'
     AND user_id='$user_id'");

    header("Location: wishlist.php");
}
?>