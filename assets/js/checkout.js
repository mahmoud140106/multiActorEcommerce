import { ProductManager } from "./productManager.js";
import { StorageManager } from "./storageManager.js";
import { CartManager } from "./cartManager.js";

let productCount;
let productId;
let currentUser=StorageManager.load('currentUser');
let deliveryDataUserObj= {};

window.addEventListener("load", function() {
// try {
    const urlParams = new URLSearchParams(window.location.search);
     productId = parseInt(urlParams.get("id"));
     productCount =parseInt(urlParams.get("count"));
    const cart = CartManager.getCart();
     console.log(cart)

     this.document.getElementById('customerId').value = currentUser.id;
     this.document.getElementById('productId').value = productId;
     this.document.getElementById('productCount').value= productCount;

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
        <div class="w-100  me-5" >
          <p class="mb-0" id="productName">${product.name} </p>
          <small class="text-muted " id="Productdetails">${product.name} / ${productCount} pieces  </small>
        </div>
        <span class=" fw-bold Subtotal text-danger" >$${product.discountedPrice?product.discountedPrice.toFixed(2):product.price.toFixed(2)}</span>
      </div>
    <br/>
      `
    }


    else if(cart){
      console.log(cart)
      let summary= document.getElementById("summary");
      cart.forEach((product,index)=>{
      summary.innerHTML += 
      `
      <div class="d-flex align-items-center">
        <div>
                  <img src='${product.image|| "https://placehold.co/500x600/png"}' 
                  class='card-img-top rounded w-50 summaryImg' 
                  product-id="${product.id}" />
        </div>
        <div class="w-100 me-5" >
          <p class="mb-0" id="productName${index}">${product.name} </p>
          <small class="text-muted " id="Productdetails">${product.name} / ${product.quantity} pieces </small>
        </div>
        <span class=" fw-bold Subtotal text-danger" >$${(product.discountedPrice?product.discountedPrice.toFixed(2):product.price.toFixed(2))*product.quantity}</span>
        
      </div>
    <br/>
      `
      });
    }

    // Update the calculation logic to handle "Buy It Now" scenario
    if (productId && productCount) {
      const product = ProductManager.getProduct(productId);
      if (product) {
        const subtotal = (product.discountedPrice || product.price) * productCount;
        const shipping = 20; // Fixed shipping cost
        const discount = 0; // No discount applied for "Buy It Now"
        const total = subtotal + shipping - discount;

        document.getElementById('Subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
      }
    } else {
      // Existing cart-based calculation
      const cartSummary = CartManager.calculateOrderSummary();
      if (cartSummary) {
        document.getElementById('Subtotal').textContent = `$${cartSummary.subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${cartSummary.shipping.toFixed(2)}`;
        document.getElementById("totalPrice").textContent = `$${cartSummary.total.toFixed(2)}`;
      }
    }

    document.querySelectorAll(".summaryImg").forEach((img) => {
      img.addEventListener("click", function () {
        const id = img.getAttribute("product-id");
        if (id) {
          window.location.href = `productDetails.html?id=${id}`;
        }
      });
    });   

     
    this.document.getElementById('userEmail').value=`${currentUser.email}`;
   let deliveryData= StorageManager.load(`${currentUser.id}`)   //get the delivery data of the current user

    this.document.querySelector(`input[name=firstName]`).value='';
    this.document.querySelector(`input[name=lastName]`).value='';
     this.document.querySelector(`input[name=address]`).value='';
     this.document.querySelector(`input[name=City]`).value='';
     document.querySelector('select[name=Governorate]').value='';
    this.document.querySelector(`input[name=PhoneNumber]`).value='';
   

    console.log(deliveryData)
   if(deliveryData){
    console.log('from delivery')
    this.document.querySelector(`input[name=firstName]`).value=deliveryData.firstName;
    this.document.querySelector(`input[name=lastName]`).value=deliveryData.lastName;
    this.document.querySelector(`input[name=address]`).value=deliveryData.address;
    this.document.querySelector(`input[name=City]`).value=deliveryData.City;
    document.querySelector('select[name=Governorate]').value = deliveryData.Governorate;
    this.document.querySelector(`input[name=PhoneNumber]`).value= deliveryData.PhoneNumber;
  }
  

   })//end of load event
   

  // } 
//   catch (error) {
//     console.error("Error loading product details in checkout page:", error);
//     document.getElementById("summaryImgDiv").innerHTML = " <img src='https://placehold.co/500x600/png' class='card-img-top rounded' />";
// }

    // Display the billing address form if the user selects "Different Address" and save shipping data for the user in storage
    // Hide the billing address form if the user selects "Same Address"

//save shipping data for the user
// let shippingData= document.querySelectorAll('.shippingData');

// document.getElementById("differentAddress").addEventListener("click", function() {
//     var billingAddress = document.getElementById("billingAddress");
//     if (this.checked) {
        
//         billingAddress.classList.remove ("d-none");
//         billingAddress.classList.add ("d-block");
//         document.getElementById("differentAddressDiv").style.border = "1px solid #212529";
//         document.getElementById("sameAddressDiv").style.border = "none";} 

//         shippingData.forEach((data)=>{
//           data.addEventListener('change',function(e){
            
//             let objKey = e.target.name;
//             shippingDataUserObj[objKey]=e.target.value;
//             console.log(shippingDataUserObj)
        
//           })
//          })
// });

// document.getElementById("sameAddress").addEventListener("click", function() {
//     var billingAddress = document.getElementById("billingAddress");
//     if (this.checked) {
        
//         billingAddress.classList.add ("d-none");
//         billingAddress.classList.remove ("d-block");
//         document.getElementById("sameAddressDiv").style.border = "1px solid #212529";
//         document.getElementById("differentAddressDiv").style.border = "none";

//         shippingDataUserObj=deliveryDataUserObj;
//     } 
// });



//save delivery data for the user
let deliveryData= document.querySelectorAll('.deliveryData');
deliveryData.forEach((data)=>{
  data.addEventListener('change',function(e){
    
    let objKey = e.target.name;
    deliveryDataUserObj[objKey]=e.target.value;

  })
 })


 document.getElementById('saveInformation').addEventListener('change',function(){
  if(this.checked){

    StorageManager.save(`${currentUser.id}`,deliveryDataUserObj);     // save the delivery data of the user in storage
                                  console.log(deliveryDataUserObj)                              //  with key userDeliveryData to display auto on load if he checked the save information box

  }
  else{
    StorageManager.remove(`${currentUser.id}`);
  }
 });

// document.getElementById('completeOrder').addEventListener('click',function(){
//   let customerId = currentUser.id;
//     StorageManager.save(`${customerId}`,deliveryDataUserObj);     // save the delivery data of the user in storage with key the id of customer
  
//   console.log(deliveryDataUserObj)
//   if(deliveryDataUserObj.firstName==''|| deliveryDataUserObj.lastName=='' || deliveryDataUserObj.address=='' || deliveryDataUserObj.City=='' || deliveryDataUserObj.Governorate=='' || deliveryDataUserObj.PhoneNumber=='')
//   {
//     showToast('Delivery data is required','error');
  
//   }
//   else{

//     console.log(deliveryDataUserObj)  
//     window.location.href=`completedOrder.html?customerId=${customerId}`;
//   }
  
// })

