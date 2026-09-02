<?php
session_start();
include 'db.php';

/* Login Check */
if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

/* Delete Product */
if(isset($_GET['delete'])){

    $id = (int)$_GET['delete'];

    mysqli_query($conn,"DELETE FROM products WHERE id='$id'");

    echo "<script>
    alert('Product Deleted Successfully');
    window.location='admin-products.php';
    </script>";
    exit();
}

$result = mysqli_query($conn,"SELECT * FROM products ORDER BY id DESC");
?>

<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title>Manage Products</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

<div class="cart-container">

<h1 style="text-align:center;">Manage Products</h1>

<br>

<a href="add-product.php">
<button>Add New Product</button>
</a>

<br><br>

<table class="orders-table">

<tr>

<th>ID</th>

<th>Image</th>

<th>Name</th>

<th>Price</th>

<th>Action</th>

</tr>

<?php while($row=mysqli_fetch_assoc($result)){ ?>

<tr>

<td><?php echo $row['id']; ?></td>

<td>

<img
src="images/<?php echo $row['image']; ?>"
width="80"
style="border-radius:8px;">

</td>

<td><?php echo $row['name']; ?></td>

<td>₹<?php echo $row['price']; ?></td>

<td>

<a
class="track-btn"
href="edit-product.php?id=<?php echo $row['id']; ?>">
Edit
</a>

&nbsp;

<a
class="track-btn"
style="background:red;"
onclick="return confirm('Delete this product?')"
href="?delete=<?php echo $row['id']; ?>">
Delete
</a>

</td>

</tr>

<?php } ?>

</table>

<br>

<a href="admin-dashboard.php">
<button>Back To Dashboard</button>
</a>

</div>

</body>
</html>