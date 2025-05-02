import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { CartManager } from "./cartManager.js";
// import { ProductManager } from "./productManager.js";
// import { CategoryManager } from "./categoryManager.js";

let allProduct = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");
let filterCategory = document.getElementById("filterCategory");
let AllCategories = CategoryManager.getAllCategories();

function product(items) {
  if (items.length == 0) {
    productPage.innerHTML = `<p class="h1 text-danger">No Products yet</p>`;
  } else {
    productPage.innerHTML = ``;
  if (items.length == 0) {
    productPage.innerHTML = `<p class="h1 text-danger">No Products yet</p>`;
  } else {
    productPage.innerHTML = ``;

    items.forEach((product, index) => {
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
        <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${
          product.id
        }"><i class="far fa-heart"></i></button>
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
      <p class="card-text text-secondary mb-2">${
        CategoryManager.getCategory(product.categoryId).name
      }</p>
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
        <button class="btn btn-dark" data-id="${
          product.id
        }">Add to cart</button>
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

    });
  }
}

//

//

// Set default option for filterCategory
filterCategory.innerHTML =
  '<option  value="AllCategories">All Categories</option>';
for (let i = 0; i < AllCategories.length; i++) {
  filterCategory.innerHTML += `<option value="${AllCategories[i].name}">${AllCategories[i].name}</option>`;
}



//from home page through category section show its products
//from home page through category section show its products

let item = window.location.href.slice(window.location.href.indexOf("=") + 1);
if (window.location.href.includes("=")) {
  
  let categoryId = 0;

let categoryId = 0;

for (let j = 0; j < AllCategories.length; j++) {
  if (item === AllCategories[j].name) {
    categoryId = AllCategories[j].id;
  }
}
for (let j = 0; j < AllCategories.length; j++) {
  if (item === AllCategories[j].name) {
    categoryId = AllCategories[j].id;
  }
}

let filterProducts = ProductManager.getProductsByCategory(categoryId);
  console.log(filterProducts);
  product(filterProducts);

}







// from home page through search input show its products
let searchItem = window.location.href.slice(window.location.href.indexOf("$") + 1);
if (window.location.href.includes("$")) {
  let searchedProducts = ProductManager.getProductsByName(searchItem);
 product(searchedProducts);
}






// Ensure all products are displayed by default
if (window.location.href.indexOf("=") == -1 && window.location.href.indexOf("$") == -1 ) {
let filterProducts = ProductManager.getProductsByCategory(categoryId);

product(filterProducts);

//default page which will be shown in product page

if (window.location.href.indexOf("=") == -1) {
  product(allProduct);
}


//change products by option categories in product page
}

//change products  by option categories in product page

filterCategory.addEventListener("change", function (e) {
  if (e.target.value == "AllCategories") {
    product(allProduct);
  } else {
    let categoryId = 0;
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
  }
});

//change products  by option Size in product page

// Set default option for filterSize
const productSize = document.getElementById("filterSize");
productSize.innerHTML = '<option value="AllSizes">All Sizes</option>';
const sizes = [...new Set(allProduct.flatMap((p) => p.sizes))];
for (let i = 0; i < sizes.length; i++) {
  productSize.innerHTML += `<option value="${sizes[i]}">${sizes[i]}</option>`;
}

// From home page through size section show its products
let sizeParam = window.location.href.slice(
  window.location.href.indexOf("size=") + 5
);
if (sizeParam) {
  let filterProducts = allProduct.filter((p) => p.sizes.includes(sizeParam));
  product(filterProducts);
  productSize.value = sizeParam;
}

// Default page
if (window.location.href.indexOf("=") === -1) {
  product(allProduct);
}

// Change products by selected size
productSize.addEventListener("change", function (e) {
  if (e.target.value == "AllSizes") {
  if (e.target.value === "AllSizes") {
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
  } else {
    let filterProducts = allProduct.filter((p) =>
      p.sizes.includes(e.target.value)
    );
    product(filterProducts);
  }
});

// change product by change price range

const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const bestSellerCheckbox = document.getElementById("bestSeller");
const newArrivalsCheckbox = document.getElementById("newArrivals");
const onSaleCheckbox = document.getElementById("onSale");
const brandSelect = document.getElementById("filterBrand");
// const genderSelect = document.getElementById("filterGender");
// const sellerSelect = document.getElementById("filterSeller");
function applyFilters() {
  const selectedCatecory = filterCategory.value;
  const selectedSize = productSize.value;
  const minPrice = parseFloat(minPriceInput.value);
  const maxPrice = parseFloat(maxPriceInput.value);
  const isBestSeller = bestSellerCheckbox.checked;
  const isNewArrival = newArrivalsCheckbox.checked;
  const isOnSale = onSaleCheckbox.checked;
  const selectedBrand = brandSelect.value;
  // const selectedGender = genderSelect.value;
  // const selectedSeller = sellerSelect.value;

  let filtered = allProduct;
  // filter category
  if (selectedCatecory !== "AllCategories") {
    filtered = filtered.filter(p >= p.AllCategories.includes(selectedCatecory));
  }
  // filter size
  if (selectedSize !== "AllSizes") {
    filtered = filtered.filter(p >= p.sizes.includes(selectedSize));
  }
  // filter range price
  if (!isNaN(minPrice)) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (!isNaN(maxPrice)) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // filter special offer
  if (isBestSeller) {
    filtered = filtered.filter((p) => p.bestSeller === true);
  }
  if (isNewArrival) {
    filtered = filtered.filter((p) => p.newArrivals === true);
  }

  if (isOnSale) {
    filtered = filtered.filter((p) => p.onSale === true);
  }

  // filter brand
  if (selectedBrand !== "AllBrands") {
    filtered = filtered.filter((p) => p.brand === selectedBrand);
  }

  // gender select
  // if (selectedGender !== "All") {
  //   filtered == filtered.filter((p) => p.gender === selectedGender);
  // }

  // seller filter
  // if (selectedSeller !== "AllSellers") {
  //   filterProducts == filterProducts.filter((p) => p.seller === selectedSeller);
  // }


  

  

  
 







  product(filtered);
  // displayProducts(filtered);
}

filterCategory.addEventListener("change", applyFilters);
productSize.addEventListener("change", applyFilters);
minPriceInput.addEventListener("change", applyFilters);
maxPriceInput.addEventListener("change", applyFilters);
bestSellerCheckbox.addEventListener("change", applyFilters);
newArrivalsCheckbox.addEventListener("change", applyFilters);
onSaleCheckbox.addEventListener("change", applyFilters);
brandSelect.addEventListener("change", applyFilters);
// genderSelect.addEventListener("change", applyFilters);
// sellerSelect.addEventListener("change", applyFilters);

// change product by special offer

// change product by brand

const brands = [...new Set(allProduct.map((p) => p.brand))];
brands.forEach((brand) => {
  brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
});

const sampleBrands = ["Nike", "addidas", "puma", "rebok"];

allProduct = allProduct.map((p) => {
  return {
    ...p,
    brand:
      p.brand ?? sampleBrands[Math.floor(Math.random() * sampleBrands.length)],
  };
});

// change product by gender

// const sampleGenders = ["Men", "Women"];
// allProduct = allProduct.map((p) => {
//   return {
//     ...p,
//     gender:
//       p.gender ??
//       sampleGenders[Math.floor(Math.random() * sampleGenders.length)],
//   };
// });

// change product by seller
// sellerSelect.innerHTML = `<option value="AllSellers">All Sellers</option>`;
// const sellers = [...new Set(allProduct.map((p) => p.seller))];
// sellers.forEach((seller) => {
//   sellerSelect.innerHTML += `<option value="${seller}">${seller}</option>`;
// });









// search 
const searchInput = document.getElementById("searchInput");



searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredProducts = allProduct.filter(product =>
    product.name.toLowerCase().includes(searchValue) ||
    product.description?.toLowerCase().includes(searchValue)
  );

  product(filteredProducts);
});


// add pagination to page
// const productsPerPage = 8;
// let currentPage = 1;
// let paginatedProducts = [];
// function displayProducts(products) {
//   paginatedProducts = products;
//   showPage(currentPage);
//   createPaginationControls();
// }

// function showPage(page) {
//   const start = (page - 1) * productsPerPage;
//   const end = start + productsPerPage;
//   const productsToShow = paginatedProducts.slice(start, end);
//   product(productsToShow);
// }

// // create button
// function createPaginationControls() {
//   const paginationContainer = document.querySelector(".pagination");
//   const totalPages = Math.ceil(paginatedProducts.length / productsPerPage);
//   paginationContainer.innerHTML = "";
//   // previous button
//   paginationContainer.innerHTML += `<li class="page-item ${
//     currentPage === 1 ? "disabled" : ""
//   }">
  
//   <a class="page-link" href="#" data-page=" ${currentPage - 1}">Previous</a>
//   </li>`;

//   for (let i = 1; i <= totalPages; i++) {
//     paginationContainer.innerHTML = `<li class="page-item ${
//       i === currentPage ? "active" : ""
//     }">
  
//   <a class="page-link" href="#" data-page=" ${i}">${i}</a>
//     </li>`;
//   }
//   // next button
//   paginationContainer.innerHTML += `<li class="page-item ${
//     currentPage === totalPages ? "disabled" : ""
//   }">
  
//   <a class="page-link" href="#" data-page=" ${currentPage + 1}">Next</a>
//   </li>`;
// }

// // add event handeller
// document.querySelector(".pagination").addEventListener("click", function (e) {
//   e.preventDefault();
//   if (e.target.tagName === "A") {
//     const selectedPage = parseInt(e.target.dataset.page);
//     if (
//       !isNaN(selectedPage) &&
//       selectedPage >= 1 &&
//       selectedPage <= Math.ceil(paginatedProducts.length / productsPerPage)
//     ) {
//       currentPage == selectedPage;
//       showPage(currentPage);
//       createPaginationControls();
//     }
//   }
// });

//     let productSize = document.getElementById("filterSize");

// productSize.addEventListener("change", function (e) {

//   if (e.target.value == "AllSizes") {

//     product(allProduct);

//   }

//   else {

//     let ProductsFilteredBySize = [];

//   for (let index = 0; index < allProduct.length; index++) {
//     for (let j = 0; j < allProduct[index].sizes.length; j++) {
//       if (allProduct[index].sizes[j] == productSize.value) {

//         ProductsFilteredBySize.push(allProduct[index]);

//       }

//     }

//   }

//   product(ProductsFilteredBySize);

//   }

// });

// ********************************************************
// import { ProductManager } from "./productManager.js";
// import { CategoryManager } from "./categoryManager.js";

// let productPage = document.getElementById("productPage");
// let filterCategory = document.getElementById("filterCategory");
// let productSize = document.getElementById("filterSize");
// let prevBtn = document.getElementById("prevBtn");
// let nextBtn = document.getElementById("nextBtn");
// let pageNumbers = document.getElementById("pageNumbers");

// let allProduct = ProductManager.getAllProducts();
// let AllCategories = CategoryManager.getAllCategories();
// let currentPage = 1;
// const itemsPerPage = 8;
// let currentItems = [];

// document.addEventListener("DOMContentLoaded", () => {

//     filterCategory.innerHTML = '<option value="AllCategories">All Categories</option>';
//     AllCategories.forEach(category => {
//         filterCategory.innerHTML += `<option value="${category.name}">${category.name}</option>`;
//     });

//     const allSizes = [...new Set(allProduct.flatMap(p => p.sizes))];
//     productSize.innerHTML = '<option value="AllSizes"> All Sizes</option>';
//     allSizes.forEach(size => {
//         productSize.innerHTML += `<option value="${size}">${size}</option>`;
//     });

//     if (window.location.href.includes("=")) {
//         const categoryName = window.location.href.split("=")[1];
//         const category = AllCategories.find(c => c.name === categoryName);
//         currentItems = category ? ProductManager.getProductsByCategory(category.id) : [];
//     } else {
//         currentItems = [...allProduct];
//     }

//     displayProducts();
//     setupPagination();
// });

// function displayProducts() {
//     if (currentItems.length === 0) {
//         productPage.innerHTML = `
//             <div class="col-12 text-center py-5">
//                 <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
//                 <p class="h4 text-muted">there is no product </p>
//             </div>
//         `;
//         return;
//     }

//     productPage.innerHTML = '';

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const paginatedItems = currentItems.slice(startIndex, endIndex);

//     paginatedItems.forEach(product => {
//         const card = document.createElement("div");
//         card.className = "col-md-6 col-lg-4 col-xl-3 mb-4";
//         card.innerHTML = `
//             <div class="card h-100 position-relative">
//                 <div class="position-relative img-container">
//                     <a href="/customer/productDetails.html?id=${product.id}">
//                         <img src="${product.images[0]}"
//                              class="card-img-top"
//                              alt="${product.name}"
//                              onerror="this.onerror=null; this.src='../images/No_Image_Available.jpg'">
//                     </a>
//                     <div class="card-icons position-absolute top-0 end-0 p-2">
//                         <button title="add to wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${product.id}">
//                             <i class="far fa-heart"></i>
//                         </button>
//                         <button title="add to cart" class="btn btn-light btn-sm rounded-circle m-1">
//                             <i class="fas fa-shopping-cart"></i>
//                         </button>
//                     </div>
//                     ${product.isOnSale ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">sale</span>' : ''}
//                 </div>
//                 <div class="card-body d-flex flex-column">
//                     <h5 class="card-title">
//                         <a href="/customer/productDetails.html?id=${product.id}" class="text-decoration-none text-dark">
//                             ${product.name}
//                         </a>
//                     </h5>
//                     <p class="card-text text-secondary">${CategoryManager.getCategory(product.categoryId).name}</p>
//                     <div class="mt-auto d-flex justify-content-between align-items-center">
//                         <div>
//                             <span class="h5">${product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)} $</span>
//                             ${product.discountedPrice ? `<small class="text-muted text-decoration-line-through ms-2">${product.price.toFixed(2)} $</small>` : ''}
//                         </div>
//                         <button class="btn btn-dark btn-sm" data-id="${product.id}">
//                             <i class="fas fa-cart-plus"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `;
//         productPage.appendChild(card);
//     });

//     updatePaginationButtons();
// }

// function setupPagination() {
//     pageNumbers.innerHTML = "";
//     const totalPages = Math.ceil(currentItems.length / itemsPerPage);

//     for (let i = 1; i <= totalPages; i++) {
//         const pageItem = document.createElement("li");
//         pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
//         pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;

//         pageItem.addEventListener("click", (e) => {
//             e.preventDefault();
//             currentPage = i;
//             displayProducts();
//         });

//         pageNumbers.appendChild(pageItem);
//     }
// }

// function updatePaginationButtons() {
//     const totalPages = Math.ceil(currentItems.length / itemsPerPage);

//     prevBtn.classList.toggle('disabled', currentPage === 1);
//     nextBtn.classList.toggle('disabled', currentPage === totalPages || totalPages === 0);

//     document.querySelectorAll('#pageNumbers .page-item').forEach(item => {
//         const pageNum = parseInt(item.textContent);
//         item.classList.toggle('active', pageNum === currentPage);
//     });
// }

// prevBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     if (currentPage > 1) {
//         currentPage--;
//         displayProducts();
//     }
// });

// nextBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const totalPages = Math.ceil(currentItems.length / itemsPerPage);
//     if (currentPage < totalPages) {
//         currentPage++;
//         displayProducts();
//     }
// });

// filterCategory.addEventListener("change", function (e) {
//     if (e.target.value === "AllCategories") {
//         currentItems = [...allProduct];
//     } else {
//         const categoryId = AllCategories.find(c => c.name === e.target.value)?.id || 0;
//         currentItems = ProductManager.getProductsByCategory(categoryId);
//     }
//     currentPage = 1;
//     displayProducts();
//     setupPagination();
// });

// productSize.addEventListener("change", function (e) {
//     if (e.target.value === "AllSizes") {
//         currentItems = [...allProduct];
//     } else {
//         currentItems = allProduct.filter(p => p.sizes.includes(e.target.value));
//     }
//     currentPage = 1;
//     displayProducts();
//     setupPagination();
// });
// ******************************************
// main
// import { ProductManager } from "./productManager.js";
// import { CategoryManager } from "./categoryManager.js";
// import { CartManager } from "./cartManager.js";

// let allProduct = ProductManager.getAllProducts();
// let productPage = document.getElementById("productPage");
// let filterCategory = document.getElementById("filterCategory");
// let AllCategories = CategoryManager.getAllCategories();
// let productSize = document.getElementById("filterSize");
// let currentItems = allProduct;
// const productsPerPage = 8;
// let currentPage = 1;

// function product(items) {
//   if (items.length === 0) {
//     productPage.innerHTML = `<p class="h1 text-danger">No Products yet</p>`;

//     return;
//   }

//   productPage.innerHTML = ``;

//   items.forEach(product => {
//     const card = document.createElement("div");
//     card.className = "col";
//     card.innerHTML = `
//       <div class="card position-relative mx-5 mx-md-0 w-100">
//         <div class="position-relative imgcontainer">
//           <a href="/customer/productDetails.html?id=${product.id}">
//             <img src="${product.images[0]}" class="card-img-top" alt="${product.name}"
//               style="height: 300px; object-fit: cover;"
//               onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
//           </a>
//           <div class="card-icons position-absolute top-0 end-0 p-2">
//             <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${product.id}">
//               <i class="far fa-heart"></i>
//             </button>
//             <button title="Add to Cart" class="btn btn-light btn-sm rounded-circle m-1 add-to-cart" data-id="${product.id}">
//               <i class="fas fa-shopping-cart"></i>
//             </button>
//           </div>
//           ${product.isOnSale ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>' : ""}
//         </div>
//         <div class="card-body p-0 my-3 text-center">
//           <a href="/customer/productDetails.html?id=${product.id}" class="text-decoration-none">
//             <h5 class="card-title mb-1">${product.name}</h5>
//           </a>
//           <p class="card-text text-secondary mb-2">${CategoryManager.getCategory(product.categoryId).name}</p>
//           <div class="p-3 border-top d-flex align-items-center justify-content-between">
//             <div>
//               $${product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}
//               ${product.discountedPrice ?`<span class="text-muted text-decoration-line-through ms-2">$${product.price.toFixed(2)}</span>` : ""}
//             </div>
//             <button class="btn btn-dark add-to-cart" data-id="${product.id}">Add to cart</button>
//           </div>
//         </div>
//       </div>
//     `;
//     productPage.appendChild(card);
//   });

//   document.querySelectorAll(".add-to-cart").forEach(button => {
//     button.addEventListener("click", () => {
//       const productId = parseInt(button.getAttribute("data-id"));
//       const product = items.find(p => p.id === productId);
//       if (product) CartManager.addToCart(product);
//     });
//   });

//   document.querySelectorAll(".add-to-wishlist").forEach(button => {
//     button.addEventListener("click", (event) => {
//       const productId = parseInt(button.getAttribute("data-id"));
//       const product = items.find(p => p.id === productId);
//       if (product) CartManager.addToWishlist(product, event);
//     });
//   });
// }

// function displayPaginatedProducts(items, page = 1) {
//   currentPage = page;
//   currentItems = items;
//   const start = (page - 1) * productsPerPage;
//   const end = start + productsPerPage;
//   const paginatedItems = items.slice(start, end);
//   product(paginatedItems);
//   createPaginationControls(items.length);
// }

// function createPaginationControls(totalItems) {
//   const totalPages = Math.ceil(totalItems / productsPerPage);
//   const paginationContainer = document.querySelector(".pagination");
//   paginationContainer.innerHTML = "";

//   if (totalPages <= 1) return;

//   paginationContainer.innerHTML += `
//     <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
//       <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
//     </li>`;

//   for (let i = 1; i <= totalPages; i++) {
//     paginationContainer.innerHTML += `
//       <li class="page-item ${currentPage === i ? "active" : ""}">
//         <a class="page-link" href="#" data-page="${i}">${i}</a>
//       </li>`;
//   }

//   paginationContainer.innerHTML += `
//     <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
//       <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
//     </li>`;

//   document.querySelectorAll(".page-link").forEach(link => {
//     link.addEventListener("click", (e) => {
//       e.preventDefault();
//       const page = parseInt(e.target.getAttribute("data-page"));
//       if (page >= 1 && page <= totalPages) {
//         displayPaginatedProducts(currentItems, page);
//       }
//     });
//   });
// }

// filterCategory.innerHTML = `<option value="AllCategories">All Categories</option>`;
// AllCategories.forEach(cat => {
//   filterCategory.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
// });

// let categoryName = new URLSearchParams(window.location.search).get("category");
// if (categoryName) {
//   const category = AllCategories.find(c => c.name === categoryName);
//   if (category) {
//     currentItems = ProductManager.getProductsByCategory(category.id);
//   }
// }

// displayPaginatedProducts(currentItems);

// filterCategory.addEventListener("change", (e) => {
//   if (e.target.value === "AllCategories") {
//     currentItems = allProduct;
//   } else {
//     const category = AllCategories.find(cat => cat.name === e.target.value);
//     currentItems = ProductManager.getProductsByCategory(category?.id || 0);
//   }
//   displayPaginatedProducts(currentItems, 1);
// });

// productSize.addEventListener("change", (e) => {
//   if (e.target.value === "AllSizes") {
//     currentItems = allProduct;
//   } else {
//     currentItems = allProduct.filter(p => p.sizes.includes(productSize.value));
//   }
//   displayPaginatedProducts(currentItems, 1);
// });

// ************************************
// last up date

// import { ProductManager } from "./productManager.js";
// import { CategoryManager } from "./categoryManager.js";
// import { CartManager } from "./cartManager.js";

// // DOM Elements
// const productPage = document.getElementById("productPage");
// const filterCategory = document.getElementById("filterCategory");
// const productSize = document.getElementById("filterSize");
// const minPriceInput = document.getElementById("minPrice");
// const maxPriceInput = document.getElementById("maxPrice");
// const paginationContainer = document.querySelector(".pagination");

// // DOM Elements
// const bestSellerFilter = document.getElementById('bestSeller');
// const newArrivalsFilter = document.getElementById('newArrivals');
// const onSaleFilter = document.getElementById('onSale');
// const filterBrand = document.getElementById('filterBrand');
// const filterSeller = document.getElementById('filterSeller');
// const ratingFilters = document.querySelectorAll('input[name="rating"]');
// const filterGender = document.getElementById('filterGender');

// // Global Variables
// let allProducts = ProductManager.getAllProducts();
// const AllCategories = CategoryManager.getAllCategories();
// const productsPerPage = 8;
// let currentPage = 1;
// let currentItems = allProducts;

// // Initialize Filters
// function initializeFilters() {
//   // Populate Category Filter
//   filterCategory.innerHTML = `<option value="AllCategories">All Categories</option>`;
//   AllCategories.forEach(cat => {
//     filterCategory.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
//   });

//   // Populate Size Filter
//   const sizes = [...new Set(allProducts.flatMap(p => p.sizes))];
//   productSize.innerHTML = `<option value="AllSizes">All Sizes</option>`;
//   sizes.forEach(size => {
//     productSize.innerHTML += `<option value="${size}">${size}</option>`;
//   });

//   // Set initial category from URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const categoryName = urlParams.get('category');
//   if (categoryName) {
//     const category = AllCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
//     if (category) filterCategory.value = category.name;
//   }

// //
//   // initial brands
//   const brands = [...new Set(allProducts.map(p => p.brand))].filter(b => b);
//   brands.forEach(brand => {
//     filterBrand.innerHTML += `<option value="${brand}">${brand}</option>`;
//   });

//   // initial brands
//   const sellers = [...new Set(allProducts.map(p => p.seller))].filter(s => s);
//   sellers.forEach(seller => {
//     filterSeller.innerHTML += `<option value="${seller}">${seller}</option>`;
//   });
// //

//  // add event listeners to new filter
//  bestSellerFilter.addEventListener('change', applyFilters);
//  newArrivalsFilter.addEventListener('change', applyFilters);
//  onSaleFilter.addEventListener('change', applyFilters);
//  filterBrand.addEventListener('change', applyFilters);
//  filterSeller.addEventListener('change', applyFilters);
//  ratingFilters.forEach(r => r.addEventListener('change', applyFilters));
//  filterGender.addEventListener('change', applyFilters);

// }

// // Render Products
// function renderProducts(products) {
//   productPage.innerHTML = products.length ? "" : `<p class="h1 text-danger text-center">No Products Found</p>`;

//   products.forEach(product => {
//     const productCard = `
//       <div class="col">
//         <div class="card position-relative h-100">
//           <div class="position-relative imgcontainer">
//             <a href="/customer/productDetails.html?id=${product.id}">
//               <img src="${product.images[0]}" class="card-img-top" alt="${product.name}"
//                 style="height: 300px; object-fit: cover;"
//                 onerror="this.src='https://dummyimage.com/500x250/cccccc/000000.png&text=No+Image';">
//             </a>
//             <div class="card-icons position-absolute top-0 end-0 p-2">
//               <button title="Add to Wishlist"
//                 class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1 ${CartManager.isInWishlist(product.id) ? 'active' : ''}"
//                 data-id="${product.id}">
//                 <i class="${CartManager.isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
//               </button>
//               <button title="Add to Cart"
//                 class="btn btn-light btn-sm rounded-circle m-1 add-to-cart"
//                 data-id="${product.id}">
//                 <i class="fas fa-shopping-cart"></i>
//               </button>
//             </div>
//             ${product.isOnSale ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>' : ''}
//           </div>
//           <div class="card-body p-0 my-3 text-center">
//             <a href="/customer/productDetails.html?id=${product.id}" class="text-decoration-none">
//               <h5 class="card-title mb-1">${product.name}</h5>
//             </a>
//             <p class="card-text text-secondary mb-2">${CategoryManager.getCategory(product.categoryId).name}</p>
//             <div class="p-3 border-top d-flex align-items-center justify-content-between">
//               <div>
//                 $${(product.discountedPrice || product.price).toFixed(2)}
//                 ${product.discountedPrice ?
//                   `<span class="text-muted text-decoration-line-through ms-2">$${product.price.toFixed(2)}</span>` : ''}
//               </div>
//               <button class="btn btn-dark add-to-cart" data-id="${product.id}">Add to cart</button>
//             </div>
//           </div>
//         </div>
//       </div>`;
//     productPage.insertAdjacentHTML('beforeend', productCard);
//   });
// }

// // Apply All Filters
// function applyFilters() {
//   let filtered = [...allProducts];

//   // Category Filter
//   if (filterCategory.value !== 'AllCategories') {
//     const category = AllCategories.find(cat => cat.name === filterCategory.value);
//     filtered = ProductManager.getProductsByCategory(category?.id || 0);
//   }

//   // Size Filter
//   if (productSize.value !== 'AllSizes') {
//     filtered = filtered.filter(p => p.sizes.includes(productSize.value));
//   }

//   // Price Filter
//   const minPrice = parseFloat(minPriceInput.value) || 0;
//   const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
//   filtered = filtered.filter(product => {
//     const price = product.discountedPrice || product.price;
//     return price >= minPrice && price <= maxPrice;
//   });

// //

// // New Filters
// // Best Seller
// if (bestSellerFilter.checked) {
//   filtered = filtered.filter(p => p.isBestSeller);
// }

// // New Arrivals
// if (newArrivalsFilter.checked) {
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//   filtered = filtered.filter(p => new Date(p.addedDate) > oneMonthAgo);
// }

// // On Sale
// if (onSaleFilter.checked) {
//   filtered = filtered.filter(p => p.isOnSale);
// }

// // Brand
// if (filterBrand.value !== 'AllBrands') {
//   filtered = filtered.filter(p => p.brand === filterBrand.value);
// }

// // Seller
// if (filterSeller.value !== 'AllSellers') {
//   filtered = filtered.filter(p => p.seller === filterSeller.value);
// }

// // Rating
// const selectedRating = document.querySelector('input[name="rating"]:checked');
// if (selectedRating) {
//   filtered = filtered.filter(p => p.rating >= parseInt(selectedRating.value));
// }

// // Gender
// if (filterGender.value !== 'All') {
//   filtered = filtered.filter(p => p.gender === filterGender.value);
// }

// currentItems = filtered;
// currentPage = 1;
// updatePagination();

// //

// }

// // Pagination
// function updatePagination() {
//   const totalPages = Math.ceil(currentItems.length / productsPerPage);
//   paginationContainer.innerHTML = '';

//   if (totalPages <= 1) return;

//   // Previous Button
//   paginationContainer.innerHTML += `
//     <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
//       <a class="page-link" href="#" data-page="prev">Previous</a>
//     </li>`;

//   // Page Numbers
//   for (let i = 1; i <= totalPages; i++) {
//     paginationContainer.innerHTML += `
//       <li class="page-item ${currentPage === i ? 'active' : ''}">
//         <a class="page-link" href="#" data-page="${i}">${i}</a>
//       </li>`;
//   }

//   // Next Button
//   paginationContainer.innerHTML += `
//     <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
//       <a class="page-link" href="#" data-page="next">Next</a>
//     </li>`;
// }

// // Event Listeners
// function setupEventListeners() {
//   // Filter Events
//   [filterCategory, productSize, minPriceInput, maxPriceInput].forEach(element => {
//     element.addEventListener('change', applyFilters);
//   });

//   // Pagination Click
//   paginationContainer.addEventListener('click', (e) => {
//     e.preventDefault();
//     if (e.target.tagName === 'A') {
//       const action = e.target.dataset.page;

//       if (action === 'prev') currentPage--;
//       else if (action === 'next') currentPage++;
//       else currentPage = parseInt(action);

//       displayCurrentPage();
//     }
//   });

//   // Add to Cart
//   productPage.addEventListener('click', (e) => {
//     if (e.target.closest('.add-to-cart')) {
//       const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
//       const product = ProductManager.getProductById(productId);
//       if (product) CartManager.addToCart(product);
//     }
//   });

//   // Wishlist Toggle
//   productPage.addEventListener('click', (e) => {
//     if (e.target.closest('.add-to-wishlist')) {
//       const button = e.target.closest('.add-to-wishlist');
//       const productId = parseInt(button.dataset.id);
//       const product = ProductManager.getProductById(productId);

//       if (product) {
//         const isInWishlist = CartManager.toggleWishlist(product);
//         button.classList.toggle('active', isInWishlist);
//         button.querySelector('i').classList.toggle('far', !isInWishlist);
//         button.querySelector('i').classList.toggle('fas', isInWishlist);
//       }
//     }
//   });
// }

// // Display Current Page
// function displayCurrentPage() {
//   const start = (currentPage - 1) * productsPerPage;
//   const end = start + productsPerPage;
//   renderProducts(currentItems.slice(start, end));
//   updatePagination();
// }

// // Initialization
// function init() {
//   initializeFilters();
//   applyFilters();
//   setupEventListeners();
// }

// // Start Application
// init();

// ***********************************************//

import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { CartManager } from "./cartManager.js";
// // ==== DOM Elements ====
const dom = {
  productPage: document.getElementById("productPage"),
  filterCategory: document.getElementById("filterCategory"),
  productSize: document.getElementById("filterSize"),
  minPrice: document.getElementById("minPrice"),
  maxPrice: document.getElementById("maxPrice"),
  bestSeller: document.getElementById("bestSeller"),
  newArrivals: document.getElementById("newArrivals"),
  onSale: document.getElementById("onSale"),
  filterBrand: document.getElementById("filterBrand"),
  filterSeller: document.getElementById("filterSeller"),
  filterGender: document.getElementById("filterGender"),
  pagination: document.querySelector(".pagination"),
};

// // ==== Global Variables ====
const config = {
  productsPerPage: 8,
  currentPage: 1,
  allProducts: ProductManager.getAllProducts(),
  categories: CategoryManager.getAllCategories(),
  currentItems: [],
};

// // ==== Core Functions ====
function initializeApp() {
  initializeFilters();
  applyFilters();
  setupEventListeners();
}

// // ==== Filter Management ====
function initializeFilters() {
  //   //
  initSelectFilter(
    dom.filterCategory,
    "AllCategories",
    config.categories.map((c) => c.name)
  );
  initSelectFilter(dom.productSize, "AllSizes", [
    ...new Set(config.allProducts.flatMap((p) => p.sizes)),
  ]);
  initSelectFilter(dom.filterBrand, "AllBrands", [
    ...new Set(config.allProducts.map((p) => p.brand)),
  ]);
  initSelectFilter(dom.filterSeller, "AllSellers", [
    ...new Set(config.allProducts.map((p) => p.seller)),
  ]);
  initSelectFilter(dom.filterGender, "All", ["Men", "Women"]);

  //  initial filter
  const urlCategory = new URLSearchParams(window.location.search).get(
    "category"
  );
  if (urlCategory) {
    const category = config.categories.find(
      (c) => c.name.toLowerCase() === urlCategory.toLowerCase()
    );
    if (category) dom.filterCategory.value = category.name;
  }
}

function initSelectFilter(element, defaultValue, options) {
  element.innerHTML = `<option value="${defaultValue}">${defaultValue}</option>`;
  options.forEach((option) => {
    element.innerHTML += `<option value="${option}">${option}</option>`;
  });
}

// // ==== Filter Application ====
// function applyFilters() {
//   let filtered = [...config.allProducts];

// //   // all filter
//   filtered = applyCategoryFilter(filtered);
//   filtered = applySizeFilter(filtered);
//   filtered = applyPriceFilter(filtered);
//   filtered = applyBrandFilter(filtered);
//   filtered = applySellerFilter(filtered);
//   filtered = applyGenderFilter(filtered);
//   filtered = applyRatingFilter(filtered);
//   filtered = applySpecialFilters(filtered);

//   config.currentItems = filtered;
//   config.currentPage = 1;
//   // updateDisplay();
// }

// // ==== Filter Helpers ====
function applyCategoryFilter(products) {
  if (dom.filterCategory.value === "AllCategories") return products;
  const category = config.categories.find(
    (c) => c.name === dom.filterCategory.value
  );
  return ProductManager.getProductsByCategory(category?.id);
}

function applySizeFilter(products) {
  return dom.productSize.value === "AllSizes"
    ? products
    : products.filter((p) => p.sizes.includes(dom.productSize.value));
}

function applyPriceFilter(products) {
  const min = parseFloat(dom.minPrice.value) || 0;
  const max = parseFloat(dom.maxPrice.value) || Infinity;
  return products.filter((p) => {
    const price = p.discountedPrice || p.price;
    return price >= min && price <= max;
  });
}

function applySpecialFilters(products) {
  let result = [...products];
  if (dom.bestSeller.checked) result = result.filter((p) => p.isBestSeller);
  if (dom.newArrivals.checked) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    result = result.filter((p) => new Date(p.addedDate) > oneMonthAgo);
  }
  if (dom.onSale.checked) result = result.filter((p) => p.isOnSale);
  return result;
}

// ==== Product Rendering ====
function renderProducts(products) {
  dom.productPage.innerHTML = products.length
    ? ""
    : '<p class="h1 text-center text-danger">No products found</p>';

  products.forEach((product) => {
    const productHTML = `
      <div class="col mb-4">
        <div class="card h-100 shadow-sm">
          ${renderProductImage(product)}
          ${renderProductBody(product)}
        </div>
      </div>`;
    dom.productPage.insertAdjacentHTML("beforeend", productHTML);
  });
}

function renderProductImage(product) {
  return `
    <div class="position-relative">
      <a href="/product.html?id=${product.id}">
        <img src="${product.images[0]}" 
             class="card-img-top" 
             alt="${product.name}"
             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
      </a>
      ${
        product.isOnSale
          ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>'
          : ""
      }
      ${renderProductIcons(product)}
    </div>`;
}

function renderProductBody(product) {
  return `
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="text-muted">${
        CategoryManager.getCategory(product.categoryId).name
      }</p>
      ${renderPriceSection(product)}
    </div>`;
}

function renderPriceSection(product) {
  return `
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <span class="h5">$${(product.discountedPrice || product.price).toFixed(
          2
        )}</span>
        ${
          product.discountedPrice
            ? `<del class="text-muted ms-2">$${product.price.toFixed(2)}</del>`
            : ""
        }
      </div>
      <button class="btn btn-primary add-to-cart" data-id="${product.id}">
        <i class="fas fa-cart-plus"></i>
      </button>
    </div>`;
}

function renderProductIcons(product) {
  return `
    <div class="card-icons position-absolute top-0 end-0 p-2">
      <button title="Add to Wishlist" 
        class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1 ${
          CartManager.isInWishlist(product.id) ? "active" : ""
        }" 
        data-id="${product.id}">
        <i class="${
          CartManager.isInWishlist(product.id) ? "fas" : "far"
        } fa-heart"></i>
      </button>
      <button title="Add to Cart" 
        class="btn btn-light btn-sm rounded-circle m-1 add-to-cart" 
        data-id="${product.id}">
        <i class="fas fa-shopping-cart"></i>
      </button>
    </div>`;
}

// // ==== filter function====

function applyBrandFilter(products) {
  return dom.filterBrand.value === "AllBrands"
    ? products
    : products.filter((p) => p.brand === dom.filterBrand.value);
}

function applySellerFilter(products) {
  return dom.filterSeller.value === "AllSellers"
    ? products
    : products.filter((p) => p.seller === dom.filterSeller.value);
}

function applyGenderFilter(products) {
  return dom.filterGender.value === "All"
    ? products
    : products.filter((p) => p.gender === dom.filterGender.value);
}

function applyRatingFilter(products) {
  const selectedRating = document.querySelector('input[name="rating"]:checked');
  return selectedRating
    ? products.filter((p) => p.rating >= parseInt(selectedRating.value))
    : products;
}

// ==== manage complete event ====

function handleProductActions(e) {
  const target =
    e.target.closest(".add-to-cart") || e.target.closest(".add-to-wishlist");
  if (!target) return;

  const productId = parseInt(target.dataset.id);
  const product = ProductManager.getProductById(productId);

  if (!product) return;

  if (target.classList.contains("add-to-cart")) {
    CartManager.addToCart(product);
    showToast("Added to cart!", "success");
  } else if (target.classList.contains("add-to-wishlist")) {
    const isInWishlist = CartManager.toggleWishlist(product);
    target.classList.toggle("active", isInWishlist);
    target.querySelector("i").className = isInWishlist
      ? "fas fa-heart"
      : "far fa-heart";
    showToast(
      isInWishlist ? "added to wishlist" : "removed from wishlist",
      "info"
    );
  }
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast show position-fixed bottom-0 end-0 m-3 bg-${type} text-white`;
  toast.innerHTML = `
    <div class="toast-body">
      ${message}
    </div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ==== pagination====

function updatePagination() {
  const totalPages = Math.ceil(
    config.currentItems.length / config.productsPerPage
  );
  dom.pagination.innerHTML = "";

  if (totalPages <= 1) return;

  dom.pagination.innerHTML = `
    <li class="page-item ${config.currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" data-action="prev">Previous</a>
    </li>
    ${Array.from(
      { length: totalPages },
      (_, i) => `
      <li class="page-item ${i + 1 === config.currentPage ? "active" : ""}">
        <a class="page-link" data-page="${i + 1}">${i + 1}</a>
      </li>
    `
    ).join("")}
    <li class="page-item ${
      config.currentPage === totalPages ? "disabled" : ""
    }">
      <a class="page-link" data-action="next">Next</a>
    </li>`;
}

// ==== ====

function updateDisplay() {
  const start = (config.currentPage - 1) * config.productsPerPage;
  const end = start + config.productsPerPage;
  renderProducts(config.currentItems.slice(start, end));
  updatePagination();
}

// ==== ====
initializeApp();

//
// ==== Event Handling ====

function handlePagination(event) {
  config.currentItems = filtered;
  config.currentPage = 1;
  const start = (config.currentPage - 1) * config.productsPerPage;
  const end = start + config.productsPerPage;
  renderProducts(config.currentItems.slice(start, end));
  const ProductsToShow = allProduct.slice(start, end);

  console.log("Pagination clicked", event);
}

function setupEventListeners() {
  //
  const filterElements = [
    dom.filterCategory,
    dom.productSize,
    dom.minPrice,
    dom.maxPrice,
    dom.bestSeller,
    dom.newArrivals,
    dom.onSale,
    dom.filterBrand,
    dom.filterSeller,
    dom.filterGender,
  ];
  filterElements.forEach((el) => el.addEventListener("change", applyFilters));

  //

  dom.pagination.addEventListener("click", handlePagination);

  //
  dom.productPage.addEventListener("click", handleProductActions);
}

// ==== Start Application ====
initializeApp();
