<?php
session_start();
include 'db.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nikunj Creation</title>

    <link rel="stylesheet" href="style.css">

    <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>

        <?php
            if(isset($_GET['wishlist']))
                {
                    echo "<div class='toast-message'>
                                Product added to Wishlist ❤️
                          </div>";
                }
        ?>
        <?php if(isset($_GET['login'])){ ?>
                <div class="toast-message">
                     Login Successful ✅
                </div>

        <?php } ?>
    <!-- Header -->
    <header>
        <h1>Nikunj Creation</h1>

        <div class="top-icons">
           
            <a href="about.html">About</a>

            <a href="contact.html">Contact</a>

            <?php if(isset($_SESSION['user_id'])){ ?>

<a href="profile.php">
    <i class="fa-solid fa-user"></i>
</a>

<?php } else { ?>

<a href="login.php">
    <i class="fa-solid fa-user"></i>
</a>

<?php } ?>

           <a href="cart.html" class="cart-icon">
                     <i class="fa-solid fa-cart-shopping"></i>
                     <span id="cart-count">0</span>
            </a>

        </div>
    </header>

        <div class="offer-banner">
              🎉 Flat 20% OFF on Bridal Jewellery | Free Delivery Above ₹999 🎉
        </div>

        <div class="slider">
            <img id="slider-image" src="images/banner1.png" alt="Banner">
        </div>

    <!-- Search -->
    <div class="search-box">
        <input type="text" id="searchInput"
        placeholder="Search Jewellery...">
    </div>

    <!-- Products -->
  <section class="products">

<?php

$query = "SELECT * FROM products";
$result = mysqli_query($conn, $query);

while($row = mysqli_fetch_assoc($result)){

?>

<div class="card">

         <a class="wishlist-icon"
                 href="add-wishlist.php?id=<?php echo $row['id']; ?>"
                     onclick="return showWishlistMessage()">
                <i class="fa-solid fa-heart"></i>
         </a>

 <img src="images/<?php echo $row['image']; ?>"
     class="product-image"
     onclick="openImage(this.src)">

    <h3><?php echo $row['name']; ?></h3>

    <p class="price">₹<?php echo $row['price']; ?></p>

    <p class="desc">
        <?php echo $row['description']; ?>
    </p>

    <div class="buttons">

<?php if($row['stock'] > 0){ ?>

            <select id="qty<?php echo $row['id']; ?>">
                    <option value="1">Qty: 1</option>
                    <option value="2">Qty: 2</option>
                    <option value="3">Qty: 3</option>
                    <option value="4">Qty: 4</option>
                    <option value="5">Qty: 5</option>
            </select>
   
   <button onclick="addToCart(
        '<?php echo $row['name']; ?>',
        <?php echo $row['price']; ?>,
        'images/<?php echo $row['image']; ?>',
        document.getElementById('qty<?php echo $row['id']; ?>').value
    )">
        Add To Cart
    </button>

    <button onclick="buyNow(
         '<?php echo $row['name']; ?>',
         <?php echo $row['price']; ?>,
         'images/<?php echo $row['image']; ?>',
         document.getElementById('qty<?php echo $row['id']; ?>').value
    )">
        Buy Now
    </button>

<?php } else { ?>

    <h3 style="color:red;">Out Of Stock</h3>

<?php } ?>

</div>

</div>

<?php
}
?>

</section>

    <footer>

    <h3>Nikunj Creation</h3>

    <p>Traditional Jewellery Collection</p>

    <p>📞 Contact: +91 80554748**</p>

    <p>📧 Email: nikunjcreation@gmail.com</p>

    <p>📍 Gangakhed, Maharashtra</p>

    <p>© 2026 Nikunj Creation. All Rights Reserved.</p>

</footer>
<script src="script.js"></script>
<!-- Image Popup -->

<div id="imageModal" class="image-modal">

    <span class="close-modal"
          onclick="closeImage()">
          &times;
    </span>

    <img id="modalImage">

</div>
</body>
</html>