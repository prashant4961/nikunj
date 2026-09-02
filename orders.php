
<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

$result = mysqli_query($conn,"
SELECT * FROM orders
WHERE user_id='$user_id'
ORDER BY id DESC");
?>

<!DOCTYPE html>
<html>
<head>
<title>My Orders</title>

<link rel="stylesheet" href="style.css?v=11">

</head>
<body>

<?php
if(isset($_GET['cancelled'])){
?>
<div class="toast-message">
✅ Order Cancelled Successfully
</div>
<?php
}
?>

<div class="cart-container">

<h1 style="margin-bottom:25px;">My Orders</h1>

<table class="orders-table">

<thead>

<tr>

<th>Order ID</th>
<th>Total Amount</th>
<th>Payment</th>
<th>Status</th>
<th>Date</th>
<th>Action</th>

</tr>

</thead>

<tbody>

<?php

while($row=mysqli_fetch_assoc($result)){

$status=$row['order_status'];

$class="";

switch($status){

case "Pending":
$class="pending";
break;

case "Packed":
$class="packed";
break;

case "Shipped":
$class="shipped";
break;

case "Out For Delivery":
$class="outfordelivery";
break;

case "Delivered":
$class="delivered";
break;

case "Cancelled":
$class="cancelled";
break;

default:
$class="pending";

}

?>

<tr>

<td><?php echo $row['id']; ?></td>

<td>₹<?php echo number_format($row['total_amount'],2); ?></td>

<td><?php echo $row['payment_status']; ?></td>

<td>

<span class="tracking <?php echo $class; ?>">

<?php echo $status; ?>

</span>

</td>

<td><?php echo $row['order_date']; ?></td>

<td>

<?php if($status=="Pending"){ ?>

<a
href="cancel-order.php?id=<?php echo $row['id']; ?>"
style="
display:block;
color:red;
font-weight:bold;
text-decoration:none;
margin-bottom:10px;
">
❌ Cancel Order
</a>

<?php } ?>

<a
class="track-btn"
href="track-order.php?id=<?php echo $row['id']; ?>">

Track Order

</a>

</td>

</tr>

<?php } ?>

</tbody>

</table>

<br><br>

<a href="index.php">

<button class="checkout-btn">

Back To Home

</button>

</a>

</div>


</body>
</html>
