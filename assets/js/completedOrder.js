import { OrderManager } from "./orderManager.js";
import{OrderItem} from "./orderManager.js";
import { StorageManager } from "./storageManager.js";

// window.addEventListener('load',function(){


//     //



// })//end of load


const urlParams = new URLSearchParams(window.location.search);
let customerId = parseInt(urlParams.get("customerId"));                 //get customer id from url
const cart = JSON.parse(localStorage.getItem('cart')) || [];        //get cart from local storage
let items =[];
cart.forEach((item,index)=>{
let orderItem= new OrderItem(item.id,item.quantity,item.price);

items[index]=orderItem;

})

OrderManager.createOrder(customerId,items);                                          //create order
let customerOrders= OrderManager.getOrdersByCustomer(customerId);                   // get customer orders
let orderId = customerOrders[customerOrders.length-1].id;                             //get the id of the last order

document.getElementById('orderId').innerText=orderId;
