// Search Function

let searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        let filter = searchInput.value.toLowerCase();

        let cards = document.querySelectorAll(".card");

        cards.forEach(card => {

            let title = card.querySelector("h3").innerText.toLowerCase();

            if (title.includes(filter)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

}


// Add To Cart

function addToCart(name, price, image, quantity){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists
    let alreadyExists = cart.some(item => item.name === name);

    if(alreadyExists){
        showToast("Product already in cart 🛒");
        return;
    }

    cart.push({
    name: name,
    price: price,
    image: image,
    quantity: quantity
});

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showToast(name + " added to cart 🛒");
}


// Buy Now

function buyNow(name, price, image, quantity){

    localStorage.removeItem("cart");

    let product = [{
        name: name,
        price: price,
        image: image,
        quantity: quantity
    }];

    localStorage.setItem("cart", JSON.stringify(product));

    localStorage.setItem("productName", name);

    window.location.href = "checkout.html";
}


// Cart Count

function updateCartCount(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = document.getElementById("cart-count");

    if(count){
        count.innerText = cart.length;
    }
}

updateCartCount();


// Image Slider

let sliderImages = [
    "images/banner1.png",
    "images/banner2.png",
    "images/banner3.png"
];

let currentImage = 0;

function changeSlider(){

    let slider = document.getElementById("slider-image");

    if(slider){

        currentImage++;

        if(currentImage >= sliderImages.length){
            currentImage = 0;
        }

        slider.src = sliderImages[currentImage];
    }
}

setInterval(changeSlider,3000);

function showToast(message){

    let toast = document.createElement("div");

    toast.className = "toast-message";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(function(){
        toast.remove();
    }, 3000);
}
 
function openImage(src){

    document.getElementById("imageModal").style.display = "flex";

    document.getElementById("modalImage").src = src;
}

function closeImage(){

    document.getElementById("imageModal").style.display = "none";
}