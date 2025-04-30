import { OrderManager } from "./orderManager.js";
import { StorageManager } from "./storageManager.js";
import { ProductManager } from "./productManager.js";

const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)
let customerId = parseInt(urlParams.get("customerId"));                 //get customer id from url
let productId =  parseInt(urlParams.get("productId"));                    //get product id from url
let productCount =  parseInt(urlParams.get("productCount"));                    //get product count from url


//fetch the delivery data of the customer from url
const customerDeliveryData ={
    firstName : urlParams.get('firstName'),
    lastName : urlParams.get('lastName'),
    address: urlParams.get('address'),
    City:urlParams.get('City'),
    Governorate:urlParams.get('Governorate'),
    PhoneNumber:urlParams.get('PhoneNumber')

}
// adding the deivery data of user in storage manager
StorageManager.save('customerDeliveryData',customerDeliveryData);

const cart = JSON.parse(localStorage.getItem('cart')) || [];        //get cart from local storage
let products = StorageManager.load('products');
const product= products.find(product=>product.id==productId);                //get product from  storage manager
let productCopy= {...product};                                              // make a copy of the product object to send in the order and keep the main product in my products
let items =[];

// if the items in cart
if(Number.isNaN(productId)){
cart.forEach((item,index)=>{
    console.log(item)

items[index]={
    productCopy,
    quantity:productCount
};

})

OrderManager.createOrder(customerId,items);                                          //create order

}

//if the item is direct from product details
else {
    console.log(product)

    items[0]={
        productCopy,
        quantity:productCount
    };
    OrderManager.createOrder(customerId,items);                                          //create order

}

let customerOrders= OrderManager.getOrdersByCustomer(customerId);                   // get customer orders

let orderId = customerOrders[customerOrders.length-1].id;                             //get the id of the last order
console.log(customerOrders)
document.getElementById('orderId').innerText=orderId;