import { ProductManager } from "./productManager.js";

let productId;
window.addEventListener("load", function() {
try {
    const urlParams = new URLSearchParams(window.location.search);
     productId = parseInt(urlParams.get("id"));

    if (isNaN(productId)) {
      console.error("Invalid product ID:", urlParams.get("id"));
      document.querySelector(".container.mt-4").innerHTML = "<p>Invalid product ID.</p>";
      return;
    }

    const product = ProductManager.getProduct(productId);
    if (!product) {
      console.error("Product not found for ID:", productId);
      document.getElementById("summaryImgDiv").innerHTML = " <img src='https://placehold.co/500x600/png' class='card-img-top rounded' />";

      return;
    }

    // Set product data in summary
    let summaryImgDiv= document.getElementById("summaryImgDiv");
    summaryImgDiv.innerHTML = ` <img src='${product.images[0] || "https://placehold.co/500x600/png"}' class='card-img-top rounded' />`
    summaryImgDiv.addEventListener('click' , function() {
        window.location.href = `productDetails.html?id=${productId}`;
    })
    document.getElementById("productName").textContent = product.name || "Unknown Product";
    document.getElementById("Productdetails").textContent = ` ${product.name} / ${product.sizes[Math.floor(Math.random()*product.sizes.length)]} / ${product.category}`;
    const subTotalPrice=document.querySelectorAll(".Subtotal");
    subTotalPrice.forEach((price) => {
      price.textContent  = product.discountedPrice
      ? `$${product.discountedPrice.toFixed(2)}`
      : `$${product.price.toFixed(2)}`;
    });
    
    document.getElementById("totalPrice").textContent =((product.discountedPrice ?? product.price) +90.00).toFixed(2);

    
  } catch (error) {
    console.error("Error loading product details in checkout page:", error);
    document.getElementById("summaryImgDiv").innerHTML = " <img src='https://placehold.co/500x600/png' class='card-img-top rounded' />";
}

    // Display the billing address form if the user selects "Different Address"
    // Hide the billing address form if the user selects "Same Address"
document.getElementById("differentAddress").addEventListener("click", function() {
    var billingAddress = document.getElementById("billingAddress");
    if (this.checked) {
        
        billingAddress.classList.remove ("d-none");
        billingAddress.classList.add ("d-block");
        document.getElementById("differentAddressDiv").style.border = "1px solid #212529";
        document.getElementById("sameAddressDiv").style.border = "none";} 
});

document.getElementById("sameAddress").addEventListener("click", function() {
    var billingAddress = document.getElementById("billingAddress");
    if (this.checked) {
        
        billingAddress.classList.add ("d-none");
        billingAddress.classList.remove ("d-block");
        document.getElementById("sameAddressDiv").style.border = "1px solid #212529";
        document.getElementById("differentAddressDiv").style.border = "none";
    } 
});

});//end of load event