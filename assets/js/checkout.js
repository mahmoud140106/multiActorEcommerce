import { ProductManager } from "./productManager.js";

let productId;
let summaryImg ;
window.addEventListener("load", function() {
// try {
    const urlParams = new URLSearchParams(window.location.search);
     productId = parseInt(urlParams.get("id"));
     const cart = JSON.parse(localStorage.getItem('cart')) || [];
   

    const product = ProductManager.getProduct(productId);
    if (!product && !cart) {
      console.error("Product not found ");
      document.getElementById("summaryImgDiv").innerHTML = " <img src='https://placehold.co/500x600/png' class='card-img-top rounded' />";
      document.getElementById("productName").textContent = "No products found";
      document.getElementById("shipping").textContent="";
      return;
    }

    // Set product data in summary
    if(product){
      console.log(product)
      let summary= document.getElementById("summary");
      summary.innerHTML += 
      `
      <div class="d-flex align-items-center">
        <div  >
                  <img src='${product.images[0]|| "https://placehold.co/500x600/png"}' 
                  class='card-img-top rounded w-50 summaryImg' 
                  product-id="${productId}"/>
        </div>
        <div class="w-100" >
          <p class="mb-0" id="productName">${product.name} </p>
          <small class="text-muted " id="Productdetails">${product.name} / ${product.brand}  </small>
        </div>
        <span class=" fw-bold Subtotal me-5" >$${product.price.toFixed(2)}</span>
      </div>
    <br/>
      `
      document.getElementById('Subtotal').textContent = `$${product.price.toFixed(2)}`;
    
      
      document.getElementById("totalPrice").textContent = `$${(product.price + 90.00).toFixed(2)}`;
       
      
    }


    else if(cart){
      console.log(cart)
      let summary= document.getElementById("summary");
      let subtotal=0;
      cart.forEach((product,index)=>{
      summary.innerHTML += 
      `
      <div class="d-flex align-items-center">
        <div  >
                  <img src='${product.image|| "https://placehold.co/500x600/png"}' 
                  class='card-img-top rounded w-50 summaryImg' 
                  product-id="${product.id}" />
        </div>
        <div class="w-100" >
          <p class="mb-0" id="productName${index}">${product.name} </p>
          <small class="text-muted " id="Productdetails">${product.name} / ${product.quantity} pieces </small>
        </div>
        <span class=" fw-bold Subtotal me-5" >$${product.price.toFixed(2)}</span>
      </div>
    <br/>
      `
      subtotal += product.price;
      document.getElementById('Subtotal').textContent = `$${subtotal.toFixed(2)}`;
    
      
      document.getElementById("totalPrice").textContent = `$${(subtotal + 90.00).toFixed(2)}`;
       
      });


    }
    document.querySelectorAll(".summaryImg").forEach((img) => {
      img.addEventListener("click", function () {
        const id = img.getAttribute("product-id");
        if (id) {
          window.location.href = `productDetails.html?id=${id}`;
        }
      });
    });   
   })//end of load event
   

  // } 
//   catch (error) {
//     console.error("Error loading product details in checkout page:", error);
//     document.getElementById("summaryImgDiv").innerHTML = " <img src='https://placehold.co/500x600/png' class='card-img-top rounded' />";
// }

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
