<?php
session_start();

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

include 'db.php';

/* Update Order Status */

if(isset($_GET['packed'])){
    $id = (int)$_GET['packed'];
    mysqli_query($conn,"UPDATE orders SET order_status='Packed' WHERE id=$id");
    header("Location: admin-orders.php");
    exit();
}

if(isset($_GET['ship'])){
    $id = (int)$_GET['ship'];
    mysqli_query($conn,"UPDATE orders SET order_status='Shipped' WHERE id=$id");
    header("Location: admin-orders.php");
    exit();
}

if(isset($_GET['out'])){
    $id = (int)$_GET['out'];
    mysqli_query($conn,"UPDATE orders SET order_status='Out For Delivery' WHERE id=$id");
    header("Location: admin-orders.php");
    exit();
}

if(isset($_GET['deliver'])){
    $id = (int)$_GET['deliver'];
    mysqli_query($conn,"UPDATE orders SET order_status='Delivered' WHERE id=$id");
    header("Location: admin-orders.php");
    exit();
}

$result = mysqli_query($conn,"SELECT * FROM orders ORDER BY id DESC");
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Customer Orders</title>

<link rel="stylesheet" href="style.css">

<style>

table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}

table th{
    background:#2874f0;
    color:#fff;
    padding:12px;
}

table td{
    border:1px solid #ddd;
    padding:10px;
    text-align:center;
}

.btn{
    display:inline-block;
    text-decoration:none;
    color:#fff;
    padding:7px 12px;
    border-radius:5px;
    margin:3px;
    font-size:13px;
}

.packed{background:#2196F3;}
.ship{background:#9C27B0;}
.out{background:#FF9800;}
.deliver{background:#28A745;}

</style>

</head>

<body>

<div class="cart-container">

<h1 style="text-align:center;">Customer Orders</h1>

<table>

<tr>
<th>ID</th>
<th>Name</th>
<th>Phone</th>
<th>Address</th>
<th>Total</th>
<th>Payment</th>
<th>Status</th>
<th>Date</th>
<th>Action</th>
</tr>

<?php while($row=mysqli_fetch_assoc($result)){ ?>

<tr>

<td><?= $row['id']; ?></td>

<td><?= $row['customer_name']; ?></td>

<td><?= $row['customer_phone']; ?></td>

<td><?= $row['customer_address']; ?></td>

<td>₹<?= $row['total_amount']; ?></td>

<td><?= $row['payment_status']; ?></td>

<td>
<b><?= $row['order_status']; ?></b>
</td>

<td><?= $row['order_date']; ?></td>

<td>

<a class="btn packed"
href="?packed=<?= $row['id']; ?>">
📦 Packed
</a>

<br><br>

<a class="btn ship"
href="?ship=<?= $row['id']; ?>">
🚚 Shipped
</a>

<br><br>

<a class="btn out"
href="?out=<?= $row['id']; ?>">
🛵 Out For Delivery
</a>

<br><br>

<a class="btn deliver"
href="?deliver=<?= $row['id']; ?>">
✅ Delivered
</a>

</td>

</tr>

<?php } ?>

</table>

</div>

</body>
</html>