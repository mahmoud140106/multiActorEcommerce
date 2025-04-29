import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";

let allProduct = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");
let filterCategory = document.getElementById("filterCategory");
let AllCategories = CategoryManager.getAllCategories();



// Set default option for filterCategory
filterCategory.innerHTML = '<option disabled selected value="">All Categories</option>';
for (let i = 0; i < AllCategories.length; i++) {
  filterCategory.innerHTML += `<option value="${AllCategories[i].name}">${AllCategories[i].name}</option>`;
}


let item = window.location.href.slice(window.location.href.indexOf("=") + 1);


let categoryId = 0;

  for (let j = 0; j < AllCategories.length; j++) {
    if (item === AllCategories[j].name   ) {
      categoryId = AllCategories[j].id;
    }
  }

  let filterProducts = ProductManager.getProductsByCategory(categoryId);



   productPage.innerHTML = ``;

   filterProducts.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
   <div class="card position-relative mx-5 mx-md-0">
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
    


  // for (let i = 0; i < filterProducts.length; i++) {
  //   productPage.innerHTML += `<div class="product-card" data-price="600" data-best-seller="false">
  //       <div class="product-image w-100" id="img1">
  //         <img class="w-100" src="${filterProducts[i].images[0]}" alt="" style="">
  //       </div>

  //       <ul class="card-action-list">
  //           <li class="card-action-item">
  //             <button class="card-action-btn" aria-labelledby="card-label-1">
  //               <ion-icon name="cart-outline"><i class="fa-solid fa-cart-shopping"></i></ion-icon>
  //             </button>
  //             <div class="card-action-tooltip" id="card-label-1">Add to Cart</div>
  //           </li>

  //           <li class="card-action-item">
  //             <button class="card-action-btn" aria-labelledby="card-label-2">
  //               <ion-icon name="heart-outline"><i class="fa-solid fa-heart"></i></ion-icon>
  //             </button>
  //             <div class="card-action-tooltip" id="card-label-2">Add to Whishlist</div>
  //           </li>

  //           <li class="card-action-item">
  //             <button class="card-action-btn" aria-labelledby="card-label-3">
  //               <ion-icon name="eye-outline"><i class="fa-solid fa-eye"></i></ion-icon>
  //             </button>
  //             <div class="card-action-tooltip" id="card-label-3">Quick View</div>
  //           </li>
  //       </ul>

  //       <div class="price text-center">
  //           <del class="del">${filterProducts[i].price + filterProducts[i].discountedPrice}</del>
  //           <span class="span">${filterProducts[i].price}</span>
  //       </div>

  //       <h3 class="text-center">
  //           <a href="#" class="card-title">${filterProducts[i].name}</a>
  //       </h3>

  //       <div class="card-rating text-center">
  //           <div class="rating-wrapper" aria-label="5 star rating">
  //             <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
  //             <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
  //             <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
  //             <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
  //             <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
  //           </div>
  //           <p class="rating-text">5170 reviews</p>
  //       </div>
  //     </div>`;
  // }

  

if (window.location.href.indexOf("=") == -1) {

  productPage.innerHTML = ``;

  allProduct.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
   <div class="card position-relative mx-5 mx-md-0">
    <div class="position-relative imgcontainer">
      <a href="/customer/productDetails.html?id=${product.id}">
        <img src="${product.images[0]}" class="card-img-top" alt="${product.name
      }" 
             style="height: 300px; object-fit: cover;" 
             onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
      </a>
      <div id ="wishlist-html" class="card-icons position-absolute top-0 end-0 p-2">
        <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${product.id}"><i class="far fa-heart"></i></button>
        <button title="Add to Cart" class="btn btn-light btn-sm rounded-circle m-1"><i class="fas fa-shopping-cart"></i></button>
      </div>
      ${product.isOnSale
        ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>'
        : ""
      }
    </div>
    <div class="card-body p-0 my-3 text-center">
      <a href="/customer/productDetails.html?id=${product.id
      }" class="text-decoration-none">
        <h5 class="card-title mb-1">${product.name}</h5>
      </a>
      <p class="card-text text-secondary mb-2">${CategoryManager.getCategory(product.categoryId).name}</p>
      <div class="p-3 border-top position-relative border-1 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <span class="">$${product.discountedPrice
        ? product.discountedPrice.toFixed(2)
        : product.price.toFixed(2)
      }</span>
          ${product.discountedPrice
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

  




  
};







  

  filterCategory.addEventListener("change", function (e) {
    console.log(e.target.value);
    let categoryId = 0;

    for (let j = 0; j < AllCategories.length; j++) {
      if (e.target.value === AllCategories[j].name) {
        categoryId = AllCategories[j].id;
      }
    }

    let filterProducts = ProductManager.getProductsByCategory(categoryId);

    console.log(filterProducts);

   productPage.innerHTML = ``;

   filterProducts.forEach((product, index) => {
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
  })