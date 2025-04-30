import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { CartManager } from "./cartManager.js";

let allProduct = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");
let filterCategory = document.getElementById("filterCategory");
let productSize = document.getElementById("filterSize");
let AllCategories = CategoryManager.getAllCategories();

// Render Products
function product(items) {
  if (items.length === 0) {
    productPage.innerHTML = `<p class="h1 text-danger">No Products yet</p>`;
    return;
  }

  productPage.innerHTML = ``;

  items.forEach((product) => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="card position-relative mx-5 mx-md-0 w-100">
        <div class="position-relative imgcontainer">
          <a href="/customer/productDetails.html?id=${product.id}">
            <img src="${product.images[0]}" class="card-img-top" alt="${product.name}" 
              style="height: 300px; object-fit: cover;" 
              onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
          </a>
          <div id="wishlist-html" class="card-icons position-absolute top-0 end-0 p-2">
            <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${product.id}">
              <i class="far fa-heart"></i>
            </button>
            <button title="Add to Cart" class="btn btn-light btn-sm rounded-circle m-1 add-to-cart" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i>
            </button>
          </div>
          ${
            product.isOnSale
              ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>'
              : ""
          }
        </div>
        <div class="card-body p-0 my-3 text-center">
          <a href="/customer/productDetails.html?id=${product.id}" class="text-decoration-none">
            <h5 class="card-title mb-1">${product.name}</h5>
          </a>
          <p class="card-text text-secondary mb-2">${CategoryManager.getCategory(product.categoryId).name}</p>
          <div class="p-3 border-top position-relative border-1 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <span class="">$${product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}</span>
              ${
                product.discountedPrice
                  ? `<span class="text-muted text-decoration-line-through ms-2">$${product.price.toFixed(2)}</span>`
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

  // Add event listeners for cart and wishlist
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      const product = items.find((p) => p.id === productId);
      if (product) {
        CartManager.addToCart(product);
      }
    });
  });

  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(button.getAttribute("data-id"));
      const product = items.find((p) => p.id === productId);
      if (product) {
        CartManager.addToWishlist(product, event);
      }
    });
  });
}

// Populate category filter
filterCategory.innerHTML = '<option value="AllCategories">All Categories</option>';
AllCategories.forEach((cat) => {
  filterCategory.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
});

// Event: Category Filter
filterCategory.addEventListener("change", function (e) {
  if (e.target.value === "AllCategories") {
    product(allProduct);
  } else {
    const selectedCategory = AllCategories.find((cat) => cat.name === e.target.value);
    const filtered = ProductManager.getProductsByCategory(selectedCategory.id);
    product(filtered);
  }
});

// Event: Size Filter
productSize.addEventListener("change", function (e) {
  if (e.target.value === "AllSizes") {
    product(allProduct);
  } else {
    const filtered = allProduct.filter((prod) =>
      prod.sizes && prod.sizes.includes(productSize.value)
    );
    product(filtered);
  }
});

// Handle page load logic
window.addEventListener("DOMContentLoaded", () => {
  const url = window.location.href;

  // Search by name (via $)
  if (url.includes("$")) {
    const nameQuery = url.slice(url.lastIndexOf("$") + 1);
    const matched = ProductManager.getProductsByName(nameQuery);
    product(matched);
  }

  // Filter by category (via =)
  else if (url.includes("=")) {
    const categoryName = url.slice(url.indexOf("=") + 1);
    const matchedCategory = AllCategories.find((cat) => cat.name === categoryName);
    const matched = matchedCategory
      ? ProductManager.getProductsByCategory(matchedCategory.id)
      : [];
    product(matched);
  }

  // Default view
  else {
    product(allProduct);
  }
});
