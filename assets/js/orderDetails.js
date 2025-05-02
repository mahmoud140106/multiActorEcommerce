import { StorageManager } from "./storageManager.js";
import { OrderManager } from "./orderManager.js";
import { showToast } from "./toast.js";
import { UserManager } from "./userManager.js";
import { ProductManager } from "./productManager.js";



let urlParams=new URLSearchParams(window.location.search);
let orderId = urlParams.get('orderId');

let order = OrderManager.getAllOrders().find(order=>order.id==orderId);
let customer=UserManager.getUser(order.customerId);
let currentUser=StorageManager.load('currentUser');

//display customer delivery data
let customerDeliveryData = StorageManager.load(`${order.customerId}`);
console.log(customerDeliveryData)

if(customerDeliveryData){
document.getElementById('firstName').value=customerDeliveryData.firstName;
document.getElementById('lastName').value=customerDeliveryData.lastName;
document.getElementById('address').value=customerDeliveryData.address;
document.getElementById('City').value=customerDeliveryData.City;
document.getElementById('Governorate').value=customerDeliveryData.Governorate;
document.getElementById('PhoneNumber').value=customerDeliveryData.PhoneNumber;
}
else{
    document.getElementById('firstName').value=customer.userName;

}

const orderItemsContainer = document.getElementById('order-items');
orderItemsContainer.innerHTML = '';

order.items.forEach((item,index)=>{
    let products= StorageManager.load('products')
    let product= products.find(product=>product.id==item.productId);
    console.log(product.sellerId)
    console.log(item.sellerId)
  if(product.sellerId==currentUser.id){
    const orderItemHTML = `
    <div class="row g-0 align-items-center p-4 cart-item">
      <div class="col-md-2 productDetailsItem" product-id="${item.productId}">
        <img src="${product.images[0]}" alt="${item.name}" class="img-fluid rounded-3" />
      </div>
      <div class="col-8 col-md-6 ps-4">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5 class="mb-1 fw-semibold">${product.name}</h5>
          </div>
         
        </div>
        <div class="d-flex align-items-center">
          <h4 class="fw-bold">Orderd Pieces:${item.quantity}</h4>
         
        </div>
      </div>
      <div class="col-3 col-md-4 text-end">
        <h5 class="fw-bold">$${(product.discountedPrice?product.discountedPrice.toFixed(2):product.price.toFixed(2))}</h5>
       
      </div>
    </div>
    ${index < order.items.length - 1 ? '<div class="divider"></div>' : ''}
    `;
    orderItemsContainer.insertAdjacentHTML('beforeend', orderItemHTML);
  }
})

document.querySelector('input[type="button"]').addEventListener('click',function(){
    window.location.href='orders.html';

})
