// import { UserManager } from "../js/userManager.js"
// import {StorageManager} from "../js/storageManager.js"
// let userName = "";
// let userEmail = "";
// let userPassword = "";
// let Role = "";
// let userId = 0;

// let tbody=document.querySelector("tbody");

// let CreatedTr = document.createElement("tr");
// let CreatedTd1 = document.createElement("td");

// let CreatedTd2 = document.createElement("td");
// let CreatedTd3 = document.createElement("td");
// let CreatedTd4 = document.createElement("td");
// let CreatedTd5 = document.createElement("td");
// let CreatedTdActions = document.createElement("td");
// CreatedTdActions.innerHTML=`<i class="fa-solid fa-pen-to-square  text-primary fs-5" data-bs-toggle="modal"  data-bs-target="#myModal">`;

//     // console.log(CreatedTdActions);
    


// let currentUsers = UserManager.getAllUsers();





// //Display All Users

// for (let index = 0; index < currentUsers.length; index++) {
//     let CreatedTr1 = document.createElement("tr");
//     CreatedTr1.innerHTML = `<td>${currentUsers[index].id}</td>
//    <td>${currentUsers[index].userName}</td>
//    <td>${currentUsers[index].email}</td>
//    <td>${currentUsers[index].password}</td>
//    <td>${currentUsers[index].role}</td>
//    <td><i class="fa-solid fa-pen-to-square  text-primary fs-5" data-bs-toggle="modal"  data-bs-target="#myModal"  ></td>  `

//     tbody.append(CreatedTr1);
    
// }





// //on click on add product show empty form

// document.getElementById("addUsers").addEventListener("click", function () {
//     let allInputs = document.querySelectorAll('input');

//     for (let index = 0; index < allInputs.length-1; index++) {
//         allInputs[index].value = '';
        
//     }
    
// });





// //remove users


// //// let elementToDelete ;


// //// tbody.addEventListener("click", function (e) {
// //     if (e.target.classList.contains("fa-trash")) {
// //         elementToDelete = e.target.closest("tr");
// //         const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteAlert"));
// //         modal.show();
// //     }
// //// });


// //// document.getElementById("DeleteUser").addEventListener("click", function () {
// //     if (elementToDelete) {
// //         const userId = elementToDelete.querySelector("td").innerText;
// //         elementToDelete.remove();
// //         UserManager.deleteUser(userId);

// //         const modalElement = document.getElementById("deleteAlert");
// //         const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
// //         modal.hide();

// //         document.body.classList.remove("modal-open");
// //         document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());

// //         elementToDelete = null; // reset


// //         let allTrs = document.getElementsByTagName('tr');
// //         for (let index = 0; index < allTrs.length; index++) {
// //             allTrs[index].document.querySelectorAll("td")[0] = index + 1;
            
// //         }
// //         for (let index = 0; index < UserManager.getAllUsers().length; index++) {
// //             UserManager.getAllUsers()[index].id = index + 1;
            
// //         }


// //     }
// //// });
// // // document.getElementById("DeleteUser").addEventListener('click', function (e) {
// // //         console.log(e);
// // //     console.log(element.getElementsByTagName('td')[0].innerText);
        
// // //     element.remove();
// // //     UserManager.deleteUser(element.getElementsByTagName('td')[0].innerText);
    

// // //     console.log(UserManager.getAllUsers());
    

// // //     // let allTr = document.getElementsByTagName('tr');
// // //     // for (let index = 0; index < allTr.length; index++) {
// // //     //     allTr[index].getElementsByTagName('td')[0].innerText = index + 1;
        
// // //     // }


// // //     UserManager.getAllUsers();
        
// // //       const modalElement = document.getElementById("deleteAlert");
// // //      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
// // //       modal.hide();

// // //     document.body.classList.remove("modal-open");
// // //     document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
        
// // //     });
   

// // edit user (show current data of the user in the form)


// let rowIndex=0;

    
// let pen = document.querySelectorAll(".fa-pen-to-square");
    
// for (let index = 0; index < pen.length; index++) {
        
//         pen[index].addEventListener("click", function (e) {

//     // Get the index of the row
    
            

//             let closeTr = this.closest('tr');
//             rowIndex = Array.from(closeTr.parentElement.children).indexOf(closeTr);

//             let allTds = closeTr.querySelectorAll('td');

             
//             // console.log(allTds[1].innerText);
//             // document.getElementById("UserID").value = allTds[0].innerText;
//             document.getElementById("UserName").value = allTds[1].innerText;
//             document.getElementById("staticEmail").value = allTds[2].innerText;
//             document.getElementById("inputPassword").value = allTds[3].innerText;
//             document.getElementById("role").value = allTds[4].innerText;
 
//         })
// }
    

// let r=false;
// let v = document.querySelectorAll('pen');
// v.forEach(element => {
//     element.addEventListener("click", function () {
//         r = true;
//     })
    
// });


// //add and update users

// document.querySelector("form").addEventListener("submit", function (e) {





//     console.log(e);
    
//     e.preventDefault();

    

    
//      CreatedTr = document.createElement("tr");
//      CreatedTd1 = document.createElement("td");

//      CreatedTd2 = document.createElement("td");
//      CreatedTd3 = document.createElement("td");
//      CreatedTd4 = document.createElement("td");
//     CreatedTd5 = document.createElement("td");
    
//     //update user data

//     if (rowIndex !== null) {

//         // console.log(rowIndex);
        
    
//         let currentRow = document.getElementsByTagName("tr")[rowIndex+1];
//         currentRow.querySelectorAll('td')[1].innerText = e.target[1].value;
//         currentRow.querySelectorAll('td')[2].innerText = e.target[2].value;
//         currentRow.querySelectorAll('td')[3].innerText = e.target[3].value;
//         currentRow.querySelectorAll('td')[4].innerText = e.target[4].value;


//         UserManager.updateUser(rowIndex + 1, e.target[1].value,e.target[2].value, e.target[3].value, e.target[4].value);
//         r = null;
//     }

//     //add user

//     else {
//         let CreatedTdActions = document.createElement("td");
//         CreatedTdActions.innerHTML=`<i class="fa-solid fa-pen-to-square  text-primary fs-5" data-bs-toggle="modal"  data-bs-target="#myModal"  >`;

//         currentUsers = UserManager.getAllUsers();
//     userId=currentUsers[currentUsers.length-1].id+1;
//     userName = e.target[1].value;
//     userEmail = e.target[2].value;
//     userPassword = e.target[3].value;
//     Role = e.target[4].value;
    

        
//     CreatedTd1.innerText = (++userId);
//     CreatedTr.appendChild(CreatedTd1);
    
    
//     CreatedTd2.innerText = userName;
//     CreatedTr.appendChild(CreatedTd2);
    
    
//     CreatedTd3.innerText = userEmail;
//     CreatedTr.appendChild(CreatedTd3);
    
    
//     CreatedTd4.innerText = userPassword;
//     CreatedTr.appendChild(CreatedTd4);
    
    
//     CreatedTd5.innerText = Role;
//     CreatedTr.appendChild(CreatedTd5);


//     CreatedTr.appendChild(CreatedTdActions);

//         tbody.appendChild(CreatedTr);
        

//         UserManager.createUser( e.target[1].value, e.target[2].value, e.target[3].value, e.target[4].value);
    
        
  
        


//     }
 
      
// })








import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { CartManager } from "./cartManager.js";

let allProduct = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");
let filterCategory = document.getElementById("filterCategory");
let AllCategories = CategoryManager.getAllCategories();

function product(items) {
  if (items.length == 0) {
    productPage.innerHTML = `<p class="h1 text-danger">No Products yet</p>`;
  } else {
    productPage.innerHTML = ``;

    items.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
   <div class="card position-relative mx-5 mx-md-0 w-100">
    <div class="position-relative imgcontainer">
      <a href="/customer/productDetails.html?id=${product.id}">
        <img src="${product.images[0]}" class="card-img-top" alt="${
        product.name
      }" 
             style="height: 300px; object-fit: cover;" 
             onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
      </a>
      <div id ="wishlist-html" class="card-icons position-absolute top-0 end-0 p-2">
        <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${
          product.id
        }"><i class="far fa-heart"></i></button>
        <button title="Add to Cart" class="btn btn-light btn-sm rounded-circle m-1 add-to-cart" data-id="${
          product.id
        }"><i class="fas fa-shopping-cart"></i></button>
      </div>
      ${
        product.isOnSale
          ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>'
          : ""
      }
    </div>
    <div class="card-body p-0 my-3 text-center">
      <a href="/customer/productDetails.html?id=${
        product.id
      }" class="text-decoration-none">
        <h5 class="card-title mb-1">${product.name}</h5>
      </a>
      <p class="card-text text-secondary mb-2">${
        CategoryManager.getCategory(product.categoryId).name
      }</p>
      <div class="p-3 border-top position-relative border-1 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <span class="">$${
            product.discountedPrice
              ? product.discountedPrice.toFixed(2)
              : product.price.toFixed(2)
          }</span>
          ${
            product.discountedPrice
              ? `<span class="text-muted text-decoration-line-through ms-2">$${product.price.toFixed(
                  2
                )}</span>`
              : ""
          }
        </div>
        <button class="btn btn-dark add-to-cart" data-id="${product.id}">Add to cart</button>
      </div>
    </div>
  </div>
`;
      productPage.appendChild(card);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const product = items.find(p => p.id === productId);
        if (product) {
          CartManager.addToCart(product);
        }
      });
    });

    // Add event listeners to "Add to Wishlist" buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
      button.addEventListener('click', (event) => {
        const productId = parseInt(button.getAttribute('data-id'));
        const product = items.find(p => p.id === productId);
        if (product) {
          CartManager.addToWishlist(product, event);
        }
      });
    });
  }
}





// Set default option for filterCategory
filterCategory.innerHTML = '<option  value="AllCategories">All Categories</option>';
for (let i = 0; i < AllCategories.length; i++) {
  filterCategory.innerHTML += `<option value="${AllCategories[i].name}">${AllCategories[i].name}</option>`;
}


// Set default option for filterCategory
filterCategory.innerHTML = '<option  value="AllCategories">All Categories</option>';
for (let i = 0; i < AllCategories.length; i++) {
  filterCategory.innerHTML += `<option value="${AllCategories[i].name}">${AllCategories[i].name}</option>`;
}



//from home page through category section show its products
let item = window.location.href.slice(window.location.href.indexOf("=") + 1);
let categoryId = 0;

for (let j = 0; j < AllCategories.length; j++) {
  if (item === AllCategories[j].name) {
    categoryId = AllCategories[j].id;
  }
}

let filterProducts = ProductManager.getProductsByCategory(categoryId);
console.log(filterProducts);

product(filterProducts);





// Ensure all products are displayed by default
if (window.location.href.indexOf("=") === -1 && window.location.href.indexOf("$") === -1 ) {
  product(allProduct);
}


//change products by option categories in product page
filterCategory.addEventListener("change", function (e) {
  if (e.target.value == "AllCategories") {
    product(allProduct);
  } else {
    let categoryId = 0;
    for (let j = 0; j < AllCategories.length; j++) {
      if (e.target.value === AllCategories[j].name) {
        categoryId = AllCategories[j].id;
      }
    }
    let filterProducts = ProductManager.getProductsByCategory(categoryId);
    product(filterProducts);
  }
});

//change products by option Size in product page
let productSize = document.getElementById("filterSize");
productSize.addEventListener("change", function (e) {
  if (e.target.value == "AllSizes") {
    product(allProduct);
  } else {
    let ProductsFilteredBySize = [];
    for (let index = 0; index < allProduct.length; index++) {
      for (let j = 0; j < allProduct[index].sizes.length; j++) {
        if (allProduct[index].sizes[j] == productSize.value) {
          ProductsFilteredBySize.push(allProduct[index]);
        }
      }
    }
    product(ProductsFilteredBySize);
  }
});