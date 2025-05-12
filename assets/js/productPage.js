import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { CartManager } from "./cartManager.js";
import { updateNavbar } from "./global.js";

let allProducts = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");
let filterCategory = document.getElementById("filterCategory");
let allCategories = CategoryManager.getAllCategories();
let currentPage = 1;
const itemsPerPage = 6;
let filteredProducts = allProducts;
// Define urlParams once at the top
const urlParams = new URLSearchParams(window.location.search);

function product(items) {
  // Filter out products with stock 0
  items = items.filter(product => product.stock > 0);
  
  if (items.length === 0) {
    productPage.innerHTML = `<p class="h1 mt-5 text-center text-secondary w-100">No Products Founded</p>`;
    updatePagination(0);
    return;
  }

  productPage.innerHTML = ``;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = items.slice(startIndex, endIndex);

  paginatedProducts.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "col";
    // console.log("product:", product);
    // console.log("image Url", product.images[0]);
    card.innerHTML = `
      <div class="card position-relative mx-5 mx-md-0">
        <div class="position-relative imgcontainer">
          <a href="/customer/productDetails.html?id=${product.id}">
            <img src="${product.images[0]}" class="card-img-top" alt="${product.name}" 
                 style="height: 300px; object-fit: cover;" 
                 onerror="this.src='https://dummyimage.com/500x250/ccc/000000&text=No+Image';">
          </a>
          <div id="wishlist-html" class="card-icons position-absolute top-0 end-0 p-2">
            <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${product.id}"><i class="far fa-heart"></i></button>
            <button title="Add to Cart" class="btn btn-light btn-sm rounded-circle m-1 add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
          </div>
          ${product.isOnSale ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>' : ""}
        </div>
        <div class="card-body p-0 my-3 text-center">
          <a href="/customer/productDetails.html?id=${product.id}" class="text-decoration-none">
            <h5 class="card-title mb-1">${product.name}</h5>
          </a>
          <p class="card-text text-secondary mb-2">${CategoryManager.getCategory(product.categoryId).name}</p>
          <div class="p-3 border-top position-relative border-1 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <span class="">$${product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}</span>
              ${product.discountedPrice ? `<span class="text-muted text-decoration-line-through ms-2">$${product.price.toFixed(2)}</span>` : ""}
            </div>
            <button class="btn btn-dark add-to-cart" data-id="${product.id}">Add to cart</button>
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
        updateNavbar();
      }
    });
  });

  // Add event listeners to "Add to Wishlist" buttons
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(button.getAttribute("data-id"));
      const product = items.find((p) => p.id === productId);
      if (product) {
        CartManager.addToWishlist(product, event);
        updateNavbar();
      }
    });
  });

  // Update wishlist button state
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    const productId = parseInt(button.getAttribute("data-id"));
    CartManager.isProductInWishlist(productId, button);
  });

  updatePagination(items.length);
}

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.querySelector(".pagination");

  // Hide pagination if total items are 6 or less, or if there are no items
  if (totalItems <= 6 || totalItems === 0) {
    pagination.style.display = 'none';
    return;
  } else {
    pagination.style.display = 'flex';
  }

  pagination.innerHTML = "";

  // Previous page
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Previous">
      <span aria-hidden="true">«</span>
    </a>
  `;
  prevLi.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      product(filteredProducts);
    }
  });
  pagination.appendChild(prevLi);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement("li");
    pageLi.className = `page-item ${i === currentPage ? "active" : ""}`;
    pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageLi.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      product(filteredProducts);
    });
    pagination.appendChild(pageLi);
  }

  // Next page
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">»</span>
    </a>
  `;
  nextLi.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      product(filteredProducts);
    }
  });
  pagination.appendChild(nextLi);
}

// Set default option for filterCategory
filterCategory.innerHTML = '<option value="AllCategories">All Categories</option>';
for (let i = 0; i < allCategories.length; i++) {
  filterCategory.innerHTML += `<option value="${allCategories[i].name}">${allCategories[i].name}</option>`;
}

// Change products by option categories in product page
filterCategory.addEventListener("change", function (e) {
  applyFilters();
});

// Search
function handleSearch() {
  let searchValue = (
    document.getElementById("searchInputModal")?.value.toLowerCase() ||
    document.getElementById("searchInput")?.value.toLowerCase() ||
    ""
  );

  // Check if there's a search query in the URL
  const urlSearchQuery = urlParams.get("products")?.toLowerCase() || "";

  // Prioritize URL search query if present, otherwise use input/modal
  searchValue = urlSearchQuery || searchValue;

  // console.log("Search value:", searchValue); // Debugging

  // If no search value, reset to all products
  if (!searchValue) {
    filteredProducts = allProducts;
  } else {
    filteredProducts = allProducts.filter((product) => {
      const category = CategoryManager.getCategory(product.categoryId);
      return (
        product.name.toLowerCase().includes(searchValue) ||
        (product.description && product.description.toLowerCase().includes(searchValue)) ||
        (category && category.name.toLowerCase().includes(searchValue))
      );
    });
  }

  // console.log("Filtered products:", filteredProducts); // Debugging

  currentPage = 1;
  product(filteredProducts); // Directly call product to show results
}

// document.getElementById("searchGo").addEventListener("click", function () {
//   handleSearch();
//   new bootstrap.Modal(document.getElementById("SearchHomeModal")).hide();
// });
function bindSearchGoEvent() {
  const searchGoButton = document.getElementById("searchGo");
  if (searchGoButton) {
    searchGoButton.addEventListener("click", () => {
      // console.log("searchGo clicked"); // Debugging
      const searchInputData = document.getElementById("searchInputModal")?.value || document.getElementById("searchInput")?.value;
      if (searchInputData) {
        // console.log("Search input data:", searchInputData); // Debugging
        // Update URL without reloading the page
        window.history.pushState({}, '', `?products=${encodeURIComponent(searchInputData.toLowerCase())}`);
        handleSearch();
        // Hide modal
        const modalElement = document.getElementById("SearchHomeModal");
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modal.hide();
        } else {
          // console.error("Modal element not found"); // Debugging
        }
      } else {
        // console.log("No search input data"); // Debugging
      }
    });
  } else {
    // console.error("searchGo button not found"); // Debugging
  }
}

// Handle URL-based search on page load
const searchQuery = urlParams.get("products")?.toLowerCase();
if (searchQuery) {
  filteredProducts = ProductManager.getProductsByName(searchQuery);
  product(filteredProducts);
}

// Input listeners for real-time search
document.getElementById("searchInput")?.addEventListener("input", () => {
  // console.log("searchInput input event"); // Debugging
  handleSearch();
});
document.getElementById("searchInputModal")?.addEventListener("input", () => {
  // console.log("searchInputModal input event"); // Debugging
  handleSearch();
});

// Bind searchGo event after DOM is fully loaded
document.addEventListener("DOMContentLoaded", bindSearchGoEvent);

// Outer filter: change product by change price range, size, or brand
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const brandSelect = document.getElementById("filterBrand");
const productSize = document.getElementById("filterSize");

function applyFilters() {
  // Reset search when applying filters
  filteredProducts = allProducts; // Reset to all products to remove search filter
  if (document.getElementById("searchInput")) {
    document.getElementById("searchInput").value = ""; // Clear search input
  }
  if (document.getElementById("searchInputModal")) {
    document.getElementById("searchInputModal").value = ""; // Clear modal search input
  }
  // Remove 'products' parameter from URL
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete("products");
  window.history.pushState({}, "", newUrl);

  const selectedCategory = filterCategory.value;
  const selectedSize = productSize.value;
  const minPrice = parseFloat(minPriceInput.value);
  const maxPrice = parseFloat(maxPriceInput.value);
  const selectedBrand = brandSelect.value;

  let filtered = filteredProducts;

  // Filter category
  if (selectedCategory !== "AllCategories") {
    filtered = filtered.filter((p) => {
      const category = CategoryManager.getCategory(p.categoryId);
      return category && category.name === selectedCategory;
    });
  }

  // Filter size
  if (selectedSize !== "AllSizes") {
    filtered = filtered.filter((p) => p.sizes.includes(selectedSize));
  }

  // Filter price range
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

  // Filter brand
  if (selectedBrand !== "AllBrands") {
    filtered = filtered.filter((p) => p.brand === selectedBrand);
  }

  currentPage = 1;
  product(filtered);
}

filterCategory.addEventListener("change", applyFilters);
productSize.addEventListener("change", applyFilters);
minPriceInput.addEventListener("change", applyFilters);
maxPriceInput.addEventListener("change", applyFilters);
brandSelect.addEventListener("change", applyFilters);

// Populate brands
const brands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))];
brands.forEach((brand) => {
  brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
});

// Handle category-based filtering from URL
const categoryName = decodeURIComponent(urlParams.get("categoryType") || "");
let categoryId = 0;

for (let j = 0; j < allCategories.length; j++) {
  if (categoryName === allCategories[j].name) {
    categoryId = allCategories[j].id;
    break;
  }
}

let urlFilteredProducts = ProductManager.getProductsByCategory(categoryId);
if (window.location.href.includes("categoryType=")) {
  filteredProducts = urlFilteredProducts;
  product(filteredProducts);
}

// Ensure all products are displayed by default
if (window.location.href.indexOf("=") == -1 && window.location.href.indexOf("$") == -1 ) {
  product(allProducts);
}