<?php
session_start();
include 'db.php';

if(isset($_POST['payment_done'])){

    $user_id = $_SESSION['user_id'];

    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $amount = $_POST['amount'];
    $product_name = $_POST['product_name'];
    $product_image = $_POST['product_image'];
    $quantity = $_POST['quantity'];

    $query = "INSERT INTO orders
    (
        user_id,
        customer_name,
        customer_phone,
        customer_address,
        product_name,
        product_image,
        quantity,
        total_amount,
        payment_status,
        order_status
    )

    VALUES
    (
        '$user_id',
        '$name',
        '$phone',
        '$address',
        '$product_name',
        '$product_image',
        '$quantity',
        '$amount',
        'Paid',
        'Pending'
    )";

    mysqli_query($conn,$query);

    mysqli_query($conn,"UPDATE products SET stock = stock - 1 WHERE name='$product_name'");

    header("Location: order-success.html");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>UPI Payment</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="login-container">

    <h2>UPI Payment</h2>

    <h3>Total Amount : ₹<span id="amount">0</span></h3>

    <br>

    <img src="images/qr.jpg" width="250">

    <br><br>

    <h3>UPI ID</h3>

    <p>nikunjcreation@oksbi</p>

    <br>

    <form method="POST">

        <input type="hidden" name="name" id="name">
        <input type="hidden" name="phone" id="phone">
        <input type="hidden" name="address" id="address">

        <input type="hidden" name="amount" id="hiddenAmount">

        <input type="hidden" name="product_name" id="productName">
        <input type="hidden" name="product_image" id="productImage">
        <input type="hidden" name="quantity" id="productQty">

        <button type="submit" name="payment_done">
            Payment Completed
        </button>

    </form>

</div>

<script>

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if(cart.length > 0){

    let item = cart[0];

    document.getElementById("productName").value = item.name;
    document.getElementById("productImage").value = item.image;
    document.getElementById("productQty").value = item.quantity;

    let total = 0;

    cart.forEach(item=>{
        total += item.price * item.quantity;
    });

    document.getElementById("amount").innerHTML = total;
    document.getElementById("hiddenAmount").value = total;
}

document.getElementById("name").value =
localStorage.getItem("customerName");

document.getElementById("phone").value =
localStorage.getItem("customerPhone");

document.getElementById("address").value =
localStorage.getItem("customerAddress");

</script>

</body>
</html>