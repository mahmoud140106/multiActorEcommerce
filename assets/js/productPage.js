import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";

let allProduct = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");
let filterCategory = document.getElementById("filterCategory");
let AllCategories = CategoryManager.getAllCategories();



function product(items) {
  
    if (items.length==0) {
    productPage.innerHTML=`<p class="h1 text-danger">No Products yet</p>`
  }

    else {

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
        <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${product.id}"><i class="far fa-heart"></i></button>
        <button title="Add to Cart" class="btn btn-light btn-sm rounded-circle m-1"><i class="fas fa-shopping-cart"></i></button>
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
      <p class="card-text text-secondary mb-2">${CategoryManager.getCategory(product.categoryId).name}</p>
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
        <button class="btn btn-dark" data-id="${product.id}">Add to cart</button>
      </div>
    </div>
  </div>
`;
      productPage.appendChild(card);
   });
    
      
  }

    
  }


  // Set default option for filterCategory
filterCategory.innerHTML = '<option  value="AllCategories">All Categories</option>';
for (let i = 0; i < AllCategories.length; i++) {
  filterCategory.innerHTML += `<option value="${AllCategories[i].name}">${AllCategories[i].name}</option>`;
}


//default page , search by name through home , select category through home

window.addEventListener("DOMContentLoaded", () => {
  // from home page through search show its products
    if (window.location.href.includes("$")) {

  let path = window.location.href.slice(window.location.href.lastIndexOf("$") + 1,);
  let productsByName = ProductManager.getProductsByName(path);
  console.log(productsByName);

  product(productsByName);

  }


  // from home page through category section show its products
    else if (window.location.href.includes("=")) { 
      


      let item = window.location.href.slice(window.location.href.indexOf("=") + 1);


let categoryId = 0;

  for (let j = 0; j < AllCategories.length; j++) {
    if (item === AllCategories[j].name   ) {
      categoryId = AllCategories[j].id;
    }
  }

  let filteredProducts = ProductManager.getProductsByCategory(categoryId);


product(filteredProducts);
      
    }
      
    // default page which will be shown in product page

    else {
       product(allProduct);
  }



});




  //change products  by option categories in product page

filterCategory.addEventListener("change", function (e) {
    

  if (e.target.value == "AllCategories") {
    product(allProduct)
  }

  else {

     let categoryId = 0;

    for (let j = 0; j < AllCategories.length; j++) {
      if (e.target.value === AllCategories[j].name) {
        categoryId = AllCategories[j].id;
      }
    }

    let filterProducts = ProductManager.getProductsByCategory(categoryId);

    console.log(filterProducts);

    product(filterProducts);
    
  }
  
  })




    //change products  by option Size in product page

 
 let productSize = document.getElementById("filterSize");

productSize.addEventListener("change", function (e) {


  if (e.target.value == "AllSizes") {

    product(allProduct);
    
  }


  else {

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










