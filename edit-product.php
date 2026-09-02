```php
<?php
session_start();
include 'db.php';

/* Login Check */
if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}

/* Check Product ID */
if(!isset($_GET['id'])){
    header("Location: admin-products.php");
    exit();
}

$id = (int)$_GET['id'];

$result = mysqli_query($conn,"SELECT * FROM products WHERE id='$id'");

if(mysqli_num_rows($result)==0){
    header("Location: admin-products.php");
    exit();
}

$row = mysqli_fetch_assoc($result);

/* Update Product */

if(isset($_POST['update'])){

    $name = mysqli_real_escape_string($conn,$_POST['name']);
    $price = mysqli_real_escape_string($conn,$_POST['price']);
    $description = mysqli_real_escape_string($conn,$_POST['description']);

    mysqli_query($conn,"
    UPDATE products SET
    name='$name',
    price='$price',
    description='$description'
    WHERE id='$id'
    ");

    echo "<script>
    alert('Product Updated Successfully');
    window.location='admin-products.php';
    </script>";

    exit();
}
?>

<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>Edit Product</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

<div class="login-container">

<h2>Edit Product</h2>

<form method="POST">

<input
type="text"
name="name"
value="<?php echo htmlspecialchars($row['name']); ?>"
required>

<input
type="number"
name="price"
value="<?php echo $row['price']; ?>"
required>

<textarea
name="description"
style="width:100%;height:120px;padding:10px;"
required><?php echo htmlspecialchars($row['description']); ?></textarea>

<br><br>

<button
type="submit"
name="update">
Update Product
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
```
