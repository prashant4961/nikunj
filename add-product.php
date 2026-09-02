<?php
session_start();
include 'db.php';

/* Admin Login Check */
if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

if(isset($_POST['add'])){

    $name = mysqli_real_escape_string($conn,$_POST['name']);
    $price = mysqli_real_escape_string($conn,$_POST['price']);
    $stock = mysqli_real_escape_string($conn,$_POST['stock']);
    $description = mysqli_real_escape_string($conn,$_POST['description']);
    $image = mysqli_real_escape_string($conn,$_POST['image']);

    $query = "INSERT INTO products
    (name,price,description,image,stock)
    VALUES
    ('$name','$price','$description','$image','$stock')";

    if(mysqli_query($conn,$query)){
        echo "<script>alert('Product Added Successfully');
        window.location='admin-products.php';
        </script>";
    }else{
        echo "<script>alert('Error : ".mysqli_error($conn)."');</script>";
    }
}
?>

<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>Add Product</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

<div class="login-container">

<h2>Add Product</h2>

<form method="POST">

<input type="text"
name="name"
placeholder="Product Name"
required>

<input type="number"
name="price"
placeholder="Product Price"
required>

<input type="number"
name="stock"
placeholder="Stock Quantity"
required>

<textarea
name="description"
placeholder="Product Description"
style="width:100%;height:100px;padding:10px;margin-top:10px;"></textarea>

<input type="text"
name="image"
placeholder="Image Name (Example : Set 1.jpeg)"
required>

<br><br>

<button type="submit" name="add">
Add Product
</button>

</form>

<br>

<center>

<a href="admin-products.php">
<button type="button">
Back
</button>
</a>

</center>

</div>

</body>
</html>