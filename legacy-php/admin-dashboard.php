<?php
session_start();

if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

include 'db.php';

$product_count = mysqli_num_rows(
    mysqli_query($conn, "SELECT * FROM products")
);

$order_count = mysqli_num_rows(
    mysqli_query($conn, "SELECT * FROM orders")
);

$user_count = mysqli_num_rows(
    mysqli_query($conn, "SELECT * FROM users")
);

$sales = mysqli_fetch_assoc(
    mysqli_query($conn,
    "SELECT SUM(total_amount) AS total_sales FROM orders")
);

$total_sales = $sales['total_sales'];

if($total_sales == ""){
    $total_sales = 0;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="cart-container">

    <h1>Admin Dashboard</h1>

    <br><br>

    <h2>📦 Total Products: <?php echo $product_count; ?></h2>

    <br>

    <h2>🛒 Total Orders: <?php echo $order_count; ?></h2>

    <br>

    <h2>👤 Total Users: <?php echo $user_count; ?></h2>

    <br>

    <h2>💰 Total Sales: ₹<?php echo $total_sales; ?></h2>

    <br><br>

    <a href="add-product.php">
        <button>Add Product</button>
    </a>

    <br><br>

    <a href="admin-products.php">
        <button>Manage Products</button>
    </a>

    <br><br>

    <a href="admin-orders.php">
        <button>View Orders</button>
    </a>

    <br><br>

    <a href="index.php">
        <button>Go To Website</button>
    </a>
<br><br>

<a href="logout.php">
    <button>Logout</button>
</a>
</div>

</body>
</html>