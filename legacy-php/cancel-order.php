<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

if(isset($_GET['id'])){

    $id = $_GET['id'];

    mysqli_query($conn,"
    UPDATE orders
    SET order_status='Cancelled'
    WHERE id='$id'
    AND user_id='$user_id'
    AND order_status='Pending'
    ");

}

header("Location: orders.php");
exit();
?>