import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { CartManager } from "./cartManager.js";
import { updateNavbar } from "./global.js";

let allProduct = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");
let filterCategory = document.getElementById("filterCategory");
let AllCategories = CategoryManager.getAllCategories();

let displayedProducts = [...allProduct]; 


product(allProduct);


function product(items) {
  displayedProducts = items;
  if (items.length == 0) {
    productPage.innerHTML = `<p class="h1 mt-5 text-center text-secondary w-100">No Products yet</p>`;
  } else {
    productPage.innerHTML = ``;

    items.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "col";
      console.log("product:", product);
      console.log("image Url", product.images[0]);
      card.innerHTML = `
   <div class="card position-relative mx-5 mx-md-0 ">
    <div class="position-relative imgcontainer">
      <a href="/customer/productDetails.html?id=${product.id}">
        <img src="${product.images[0]}" class="card-img-top" alt="${
        product.name
      }" 
             style="height: 300px; object-fit: cover;" 
             onerror="this.src='https://dummyimage.com/500x250/ccc/000000&text=No+Image';">
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
        <button class="btn btn-dark add-to-cart" data-id="${
          product.id
        }">Add to cart</button>
      </div>
    </div>
  </div>
`;
      productPage.appendChild(card);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = parseInt(button.getAttribute("data-id"));
        const product = items.find((p) => p.id === productId);
        if (product) {
          CartManager.addToCart(product);
          updateNavbar(); // Update the cart count in the navbar
        }
      });
    });



    
  // search about product through home

  
  
  
  document.getElementById("searchGo").addEventListener("click", function (e) {

    let searchInputData = document.getElementById("searchInput").value;
  
    window.location.href = `../../customer/product.html?products$${searchInputData.toLowerCase()}`;
 
  })
    // Add event listeners to "Add to Wishlist" buttons
    document.querySelectorAll(".add-to-wishlist").forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = parseInt(button.getAttribute("data-id"));
        const product = items.find((p) => p.id === productId);
        if (product) {
          CartManager.addToWishlist(product, event);
          updateNavbar(); // Update the wishlist count in the navbar
        }
      });
    });
  }
}

// Set default option for filterCategory
filterCategory.innerHTML =
  '<option  value="AllCategories">All Categories</option>';
for (let i = 0; i < AllCategories.length; i++) {
  filterCategory.innerHTML += `<option value="${AllCategories[i].name}">${AllCategories[i].name}</option>`;
}


//from home page through category section show its products
let item = window.location.href.slice(window.location.href.indexOf("=") + 1);
if (window.location.href.includes("=")) {
  
  let categoryId = 0;

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



// search
searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();
  const filteredProducts = allProduct.filter(
    (product) =>
      product.name.toLowerCase().includes(searchValue) ||
      product.description?.toLowerCase().includes(searchValue)
  );
  product(filteredProducts);
  changePage(1); 
});

//outer filter // change product by change price range

const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const brandSelect = document.getElementById("filterBrand");
const productSize = document.getElementById("filterSize");

function applyFilters() {
  const selectedCategory = filterCategory.value;
  const selectedSize = productSize.value;
  const minPrice = parseFloat(minPriceInput.value);
  const maxPrice = parseFloat(maxPriceInput.value);
  const selectedBrand = brandSelect.value;

  let filtered = allProduct;

  // filter category
  if (selectedCategory !== "AllCategories") {
    filtered = filtered.filter((p) => {
      const category = CategoryManager.getCategory(p.categoryId);
      return category && category.name === selectedCategory;
    });
  }

  // filter size
  if (selectedSize !== "AllSizes") {
    filtered = filtered.filter((p) => p.sizes.includes(selectedSize));
  }

  // filter range price
  if (!isNaN(minPrice)) {
    filtered = filtered.filter((p) => {
      const price = p.discountedPrice || p.price;
      return price >= minPrice;
    });
  }
  if (!isNaN(maxPrice)) {
    filtered = filtered.filter((p) => {
      const price = p.discountedPrice || p.price;
      return price <= maxPrice;
    });
  }

  // filter brand
  if (selectedBrand !== "AllBrands") {
    filtered = filtered.filter((p) => p.brand === selectedBrand);
  }
console.log("selected size",selectedSize);
console.log("selected size",filtered);
  product(filtered);
}

filterCategory.addEventListener("change", applyFilters);
productSize.addEventListener("change", applyFilters);
minPriceInput.addEventListener("change", applyFilters);
maxPriceInput.addEventListener("change", applyFilters);
brandSelect.addEventListener("change", applyFilters);

// Populate brands
const brands = [...new Set(allProduct.map((p) => p.brand).filter(Boolean))];
brands.forEach((brand) => {
  brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
});

// pagination
let currentPage =1;
const itemsPerPage=6
const totalPages=Math.ceil(allProduct.length/itemsPerPage);
function changePage(page) {
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginationItems = displayedProducts.slice(start, end);

  document.querySelectorAll(".pagination .page-link").forEach(link => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(`.pagination .page-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add("active");

  product(paginationItems);
}

 function previousPage(){
  if(currentPage >1){
    changePage(currentPage-1)
  }
 }

 function nextPage(){
  if(currentPage < totalPages){
    changePage(currentPage +1)
  }
 }
changePage(1);

window.changePage=changePage;
window.nextPage=nextPage;
window.previousPage=previousPage;






