import { CartManager } from "./cartManager.js";
import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { updateNavbar } from "./global.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initial renders
  renderWishlist();
  renderRecommendedProducts();
  updateNavbar();

  // Update wishlist button state for all items in the wishlist
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    const productId = parseInt(button.getAttribute("data-id"));
    CartManager.isProductInWishlist(productId, button);
  });

  // add event listener to product img to redirect to product details onclic

  document.querySelectorAll("img").forEach((img)=>{
    img.addEventListener('click',function(){
     let productId= img.getAttribute('data-id');
     window.location.href = `productDetails.html?id=${productId}`;
    })
  })
});

function renderWishlist() {
  const wishlist = CartManager.getWishlist();
  const wishlistContainer = document.querySelector(".card-body.p-0");
  const summaryContainer = document.querySelector(".col-lg-3 .card-body");
  const headerCount = document.querySelector("#wishlist-item-count");

  // Clear existing items
  wishlistContainer.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
            <div class="p-4 text-center">
                <i class="far fa-heart text-danger fa-3x mb-3"></i>
                <h5 class="mb-2">Your wishlist is empty</h5>
                <p class="text-muted">Add items to your wishlist to save them for later</p>
                <a href="product.html" class="btn btn-dark mt-3">Continue Shopping</a>
            </div>
        `;

    // Update summary
    summaryContainer.innerHTML = `
            <h5 class="card-title fw-semibold mb-4">Wishlist Summary</h5>
            <div class="text-center py-4">
                <i class="far fa-heart text-muted fa-2x"></i>
                <p class="mt-2 mb-0">No items in wishlist</p>
            </div>
        `;

    // Update header count
    if (headerCount) {
      headerCount.textContent = "0 items";
    }

    return;
  }

  let totalValue = 0;

  // Generate wishlist items HTML
  wishlist.forEach((item, index) => {
    const productId = item.id;

    totalValue += item.price * (item.quantity || 1);

    const itemHTML = `
            <div class="row g-0 align-items-center p-4 wishlist-item w-100" >
                <div class="col-3 text-center">
                    <img src="${item.image}" alt="${item.name}" data-id="${productId}" class="img-fluid rounded-3">
                </div>
                <div class="col-6 ps-4">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="mb-1 fw-semibold">${item.name}</h5>
                            <br>
                            <br>
                        </div>
                    </div>
                    <div class="d-flex mt-2">
                        <h5 class="fw-semibold">$${item.price.toFixed(2)}</h5>
                    </div>
                </div>
                <div class="col-3 text-end">
                    <div class="d-flex flex-column gap-2">
                        <button class="btn btn-dark add-to-cart-btn" data-id="${productId}">
                            <i class="fas fa-shopping-cart me-2"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-danger remove-item-btn mt-2" data-id="${productId}">
                            <i class="fas fa-trash-alt me-2"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
            ${index < wishlist.length - 1 ? '<div class="divider"></div>' : ""}
        `;
    wishlistContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  // Update summary
  summaryContainer.innerHTML = `
        <h5 class="card-title fw-semibold mb-4">Wishlist Summary</h5>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Total Items</span>
            <span>${wishlist.length}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between mb-3">
            <strong>Total Value</strong>
            <span class="fw-bold fs-5">$${totalValue.toFixed(2)}</span>
        </div>
        <button id="add-all-to-cart" class="btn btn-dark rounded-pill w-100 py-3 fw-semibold mb-3">
            <i class="fas fa-shopping-cart me-2"></i>Add All to Cart
        </button>
        <div class="alert alert-info py-2 small mb-0" role="alert">
            <i class="fas fa-info-circle me-2"></i> Items in your wishlist will be saved for 30 days
        </div>
    `;

  // Update header count
  if (headerCount) {
    headerCount.textContent = `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""}`;
  }

  // Add event listeners after rendering
  addEventListeners();
}

function addEventListeners() {
  // Remove existing event listeners to prevent duplication
  const clearWishlistBtn = document.querySelector(".btn-danger.rounded-pill");
  if (clearWishlistBtn) {
    const newClearWishlistBtn = clearWishlistBtn.cloneNode(true);
    clearWishlistBtn.parentNode.replaceChild(newClearWishlistBtn, clearWishlistBtn);
    newClearWishlistBtn.addEventListener("click", () => {
      if (CartManager.clearWishlist()) {
        renderWishlist();
        updateNavbar();
      }
    });
  }

  // Remove item buttons
  document.querySelectorAll(".remove-item-btn").forEach((button) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      CartManager.removeFromWishlist(productId);
      renderWishlist();
      updateNavbar();
    });
  });

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      CartManager.addToCartFromWishlist(productId);
      renderWishlist();
      updateNavbar();
    });
  });

  // Add all to cart button
  const addAllToCartBtn = document.getElementById("add-all-to-cart");
  if (addAllToCartBtn) {
    const newAddAllToCartBtn = addAllToCartBtn.cloneNode(true);
    addAllToCartBtn.parentNode.replaceChild(newAddAllToCartBtn, addAllToCartBtn);
    newAddAllToCartBtn.addEventListener("click", function () {
      CartManager.addAllToCart();
      renderWishlist();
      updateNavbar();
    });
  }
}

function renderRecommendedProducts() {
  const recommendationsContainer = document.getElementById("recommendedProducts");
  if (!recommendationsContainer) return;

  // Clear existing recommendations
  recommendationsContainer.innerHTML = "";

  // Get wishlist items to avoid recommending items already in wishlist
  const wishlist = CartManager.getWishlist();
  const wishlistIds = wishlist.map((item) => parseInt(item.id));

  // Get all products
  let products = ProductManager.getAllProducts();
  // Filter out wishlist items, products with stock 0, and get random products
  products = products
    .filter((product) => !wishlistIds.includes(product.id) && product.stock > 0)
    .sort(() => 0.5 - Math.random())
    .slice(0, 8); // Get 8 products for carousel

  // Title for the section
  const sectionTitle = document.createElement("div");
  sectionTitle.className = "col-12 mb-4";
  sectionTitle.innerHTML = `
      <h3 class="fw-semibold">You May Also Like</h3>
  `;
  recommendationsContainer.appendChild(sectionTitle);

  // Create carousel structure
  const carouselContainer = document.createElement("div");
  carouselContainer.id = "recommendedCarousel";
  carouselContainer.className = "carousel slide";
  carouselContainer.setAttribute("data-bs-ride", "carousel");

  const carouselInner = document.createElement("div");
  carouselInner.className = "carousel-inner";

  // Determine number of products per slide based on screen size
  const isMobile = window.innerWidth <= 768;
  const productsPerSlide = isMobile ? 1 : 4;

  // Group products into slides
  for (let i = 0; i < products.length; i += productsPerSlide) {
    const slideProducts = products.slice(i, i + productsPerSlide);
    const carouselItem = document.createElement("div");
    carouselItem.className = `carousel-item ${i === 0 ? "active" : ""}`;

    // Create row for product cards
    const rowContainer = document.createElement("div");
    rowContainer.className = `row row-cols-1 ${isMobile ? '' : 'row-cols-md-2 row-cols-lg-4'} g-4`;

    slideProducts.forEach((product) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
          <div class="card position-relative mx-5 mx-md-0">
            <div class="position-relative imgcontainer">
              <a href="/customer/productDetails.html?id=${product.id}">
                <img src="${product.images[0]}" class="card-img-top" alt="${product.name}" 
                     style="height: 300px; object-fit: cover;" 
                     product-id="${product.id}"
                     onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
              </a>
              <div class="card-icons position-absolute top-0 end-0 p-2">
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
                  <span class="">$${
                    product.discountedPrice
                      ? product.discountedPrice.toFixed(2)
                      : product.price.toFixed(2)
                  }</span>
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
      rowContainer.appendChild(card);
    });

    carouselItem.appendChild(rowContainer);
    carouselInner.appendChild(carouselItem);
  }

  carouselContainer.appendChild(carouselInner);

  // Add carousel controls
  carouselContainer.innerHTML += `
    <button class="carousel-control-prev" type="button" data-bs-target="#recommendedCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#recommendedCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  `;

  recommendationsContainer.appendChild(carouselContainer);

  // Add event listeners for the new buttons
  attachRecommendationEventListeners();
}

function attachRecommendationEventListeners() {
  // Add event listeners to "Add to Cart" buttons in recommendations
  document
    .querySelectorAll("#recommendedProducts .add-to-cart")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = parseInt(button.getAttribute("data-id"));
        let products = ProductManager.getAllProducts();
        const product = products.find((p) => p.id === productId);

        if (product) {
          CartManager.addToCart(product);
          updateNavbar();
        }
      });
    });

  // Add event listeners to "Add to Wishlist" buttons
  document
    .querySelectorAll("#recommendedProducts .add-to-wishlist")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = parseInt(button.getAttribute("data-id"));
        const products = ProductManager.getAllProducts();
        const product = products.find((p) => p.id === productId);

        if (product) {
          CartManager.addToWishlist(product, event);
          // Update the UI
          renderWishlist();
          updateNavbar();
        }
      });
    });
}