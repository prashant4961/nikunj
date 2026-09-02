<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

$id = (int)$_GET['id'];

$result = mysqli_query($conn,"SELECT * FROM orders WHERE id='$id'");

if(mysqli_num_rows($result)==0){
    die("Order Not Found");
}

$order = mysqli_fetch_assoc($result);

$status = trim($order['order_status']);
?>

<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title>Track Order</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

<div class="track-container">

<h1 style="text-align:center;">Track Your Order</h1>

<div style="text-align:center;margin:30px 0;">

<img src="/Nikunj-Creation/<?php echo $order['product_image']; ?>"
width="220"
style="border:1px solid #ddd;border-radius:10px;padding:10px;background:#fff;">

<h2><?php echo $order['product_name']; ?></h2>

<h3>Price : ₹<?php echo $order['total_amount']; ?></h3>

<h3>Quantity : <?php echo $order['quantity']; ?></h3>

<h3>Order ID : #<?php echo $order['id']; ?></h3>

<h3>👤 <?php echo $order['customer_name']; ?></h3>

<h3>📞 <?php echo $order['customer_phone']; ?></h3>

<h3>📍 <?php echo $order['customer_address']; ?></h3>

</div>

<hr><br>

<div class="timeline">

<div class="track-step <?php echo in_array($status,['Pending','Packed','Shipped','Out For Delivery','Delivered']) ? 'done' : ''; ?>">
<div class="circle">✓</div>
<p>Order Placed</p>
</div>

<div class="track-step <?php echo in_array($status,['Packed','Shipped','Out For Delivery','Delivered']) ? 'done' : ''; ?>">
<div class="circle">✓</div>
<p>Packed</p>
</div>

<div class="track-step <?php echo in_array($status,['Shipped','Out For Delivery','Delivered']) ? 'done' : ''; ?>">
<div class="circle">✓</div>
<p>Shipped</p>
</div>

<div class="track-step <?php echo in_array($status,['Out For Delivery','Delivered']) ? 'done' : ''; ?>">
<div class="circle">✓</div>
<p>Out For Delivery</p>
</div>

<div class="track-step <?php echo ($status=="Delivered") ? 'done' : ''; ?>">
<div class="circle">✓</div>
<p>Delivered</p>
</div>

</div>

<br><br>

<center>

<a href="orders.php" class="track-btn">
Back To Orders
</a>

</center>

</div>

</body>
</html>