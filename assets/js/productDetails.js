import { CategoryManager } from "./categoryManager.js";
import { ProductManager } from "./productManager.js";
import { StorageManager } from "./storageManager.js";
import { CartManager } from "./cartManager.js";
import { updateNavbar } from "./global.js";

let user = StorageManager.load("currentUser"); // Get current user from storage
let productId;
let AllProducts;
let product;
let r;
let productCountInput;
let productCount;
document.addEventListener("DOMContentLoaded", () => {
  // console.log("product details.js loaded");
  try {
    const urlParams = new URLSearchParams(window.location.search);
    productId = parseInt(urlParams.get("id"));
    productCountInput = document.getElementById("productCount");
    productCount = productCountInput.value;
    AllProducts = ProductManager.getAllProducts();
    if (isNaN(productId)) {
      console.error("Invalid product ID:", urlParams.get("id"));
      document.querySelector(".container.mt-4").innerHTML =
        "<p>Invalid product ID.</p>";
      return;
    }

    product = ProductManager.getProduct(productId);

    if (!product) {
      console.error("Product not found for ID:", productId);
      document.querySelector(".container.mt-4").innerHTML =
        "<p>Product not found.</p>";
      return;
    }

    // Set product details
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").textContent =
      product.name || "Unknown Product";
    document.getElementById("category").textContent = `Category: ${
      CategoryManager.getCategory(product.categoryId).name || "N/A"
    }`;
    document.getElementById("price").innerHTML =    `<span class="text-danger">$${
                          product.discountedPrice
                            ? product.discountedPrice.toFixed(2)
                            : product.price.toFixed(2)
                        }</span>
                        ${
                          product.discountedPrice
                            ? `<span class="text-muted text-decoration-line-through ms-2">$${product.price.toFixed(2)}</span>`
                            : ""
                        }`
    document
      .getElementById("productCount")
      .setAttribute("max", `${product.stock}`);
    document.getElementById(
      "stockCount"
    ).textContent = `${product.stock} in stock`;
    document.querySelector(
      ".styled-slider"
    ).style.background = `linear-gradient(to right, #d49117 ${
      product.stock
    }%, #e0e0e0 ${30}%)`;
    // document.getElementById("sizes").textContent = product.sizes?.length
    //   ? product.sizes.join(", ")
    //   : "N/A";
    // document.getElementById("sku").textContent = product.sku || "N/A";
    let productRating = document.getElementById("productRating");
    for (let i = 0; i < product.rating; i++) {
      let star = document.createElement("i");
      star.className = "fa-solid fa-star starRating"; // Create star element
      productRating.appendChild(star); // Append star to the span
    }
    document.getElementById("descriptionSection").innerHTML +=
      `<br/> ${product.description}
    
   ` || "No description available";
    //  <br/> <strong>Brand:</strong> ${product.brand || "N/A"}
    //  <br/> <strong>Colors:</strong> ${product.colors?.length ? product.colors.join(", ") : "N/A"}
    // Render carousel images dynamically
    const carouselImages = document.getElementById("carouselImages");
    const carouselThumbnails = document.getElementById("carouselThumbnails");
    carouselImages.innerHTML = "";
    carouselThumbnails.innerHTML = "";

    if (!product.images || product.images.length === 0) {
      console.warn("No images found for product:", product.id);
      carouselImages.innerHTML = `
        <div class="carousel-item active">
          <img src="https://dummyimage.com/500x250/cccccc/000000&text=No+Image" class="d-block w-100" alt="No Image" style="height: 250px; object-fit: cover;">
        </div>
      `;
    } else {
      product.images.forEach((image, index) => {
        // Carousel item
        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
        carouselItem.innerHTML = `
          <img src="${image}" class="d-block w-100" alt="${
          product.name || "Product"
        }" style="height: 100%; object-fit: cover;" 
               onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
        `;
        carouselImages.appendChild(carouselItem);

        // Thumbnail
        const thumbnail = document.createElement("div");
        thumbnail.className = "imglabel";
        thumbnail.dataset.bsTarget = "#carouselExampleControls";
        thumbnail.dataset.bsSlideTo = index;
        thumbnail.ariaLabel = `Slide ${index + 1}`;
        if (index === 0) thumbnail.classList.add("active");
        thumbnail.innerHTML = `
          <img src="${image}" alt="${
          product.name || "Product"
        }" style="height: 80px; width: 80px; object-fit: cover;" 
               onerror="this.src='https://dummyimage.com/80x80/cccccc/000000&text=No+Image';">
        `;
        carouselThumbnails.appendChild(thumbnail);
      });
    }

    // Handle thumbnail active state
    const thumbnails = document.querySelectorAll(".imglabel img");
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        thumbnails.forEach((img) => img.classList.remove("active-thumbnail"));
        thumb.classList.toggle("active-thumbnail");
      });
    });

   
  } catch (error) {
    console.error("Error loading product details:", error);
    document.querySelector(".container.mt-4").innerHTML =
      "<p>Error loading product details.</p>";
  }

 

  //product count
  productCountInput.addEventListener("change", function (e) {
    productCountInput.setAttribute("value", `${e.target.value}`);
    productCount = productCountInput.value;
    // console.log(productCountInput);
    // console.log(productCount);
  });
  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      const product = AllProducts.find((p) => p.id === productId);
      CartManager.addToCart(product);
    });
  });

  renderRecommendedProducts();
  //add event listener to recommendation cards to link with product details
  document.querySelectorAll(".cursol-img ").forEach((card) =>
    card.addEventListener("click", function () {
      const id = card.getAttribute("product-id");
      if (id) {
        window.location.href = `productDetails.html?id=${id}`;
      }
    })
  );

  // Add event listeners to "Add to Wishlist" buttons
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(button.getAttribute("data-id"));
      const product = AllProducts.find((p) => p.id === productId);
      if (product) {
        CartManager.addToWishlist(product, event);
        updateNavbar(); // Update the navbar to reflect the new wishlist count
      }
    });
  });
}); //end of load
 
document.getElementById("reviewsBtn").addEventListener("click", showReviews); //show reviews section

function showReviews() {
  //show reviews section
  let reviewSection = document.getElementById("reviewSection");
  reviewSection.classList.remove("d-none");
  descriptionSection.classList.add("d-none");
  document.getElementById("reviewsBtn").disabled=true;
  document.getElementById("descriptionBtn").disabled=false;
  
}

document
  .getElementById("descriptionBtn")
  .addEventListener("click", showDescription);

function showDescription() {
  //show description section
  let descriptionSection = document.getElementById("descriptionSection");
  descriptionSection.classList.remove("d-none");
  reviewSection.classList.add("d-none");
    document.getElementById("descriptionBtn").disabled=true;
  document.getElementById("reviewsBtn").disabled=false;

}

//add to cart button function
document.getElementById("addTocart").addEventListener("click", function () {
  if (productCount < 1) {
    productCount = 1;
  }
  CartManager.addToCart(product, parseInt(productCount)); // Pass the selected quantity to the cart
  updateNavbar(); // Update the navbar to reflect the new cart count
});

// Redirect to checkout page when "Buy It Now" is clicked
document.getElementById("buyItNow").addEventListener("click", function () {
  if (user == null) {
    CartManager.showToast("Please log in first");
    return;
  }
  if (productCount < 1) {
    productCount = 1;
  }
  window.location.href = `checkout.html?id=${productId}&count=${productCount} `; // Redirect to checkout page with product ID
});

function renderRecommendedProducts(){
  // set recommendation products
  const recommendationsContainer = document.getElementById("recommendationSection");
  if (!recommendationsContainer) return;

  // Clear existing recommendations
  recommendationsContainer.innerHTML = "";

  // Get all products
  let products = ProductManager.getAllProducts();
  // Filter out current product and products with stock 0, and get random products
  products = products
    .filter((product) => product.id !== productId && product.stock > 0)
    .sort(() => 0.5 - Math.random())
    .slice(0, 8); // Get 8 products for carousel

  // Title for the section
  const sectionTitle = document.createElement("div");
  sectionTitle.className = "col-12 mb-4";
  sectionTitle.innerHTML = `
      <h3 class="fw-semibold">Recommendation For You</h3>
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
          <div class="card position-relative mx-2 mx-md-0">
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
    .querySelectorAll("#recommendedCarousel .add-to-cart")
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
    .querySelectorAll("#recommendedCarousel .add-to-wishlist")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = parseInt(button.getAttribute("data-id"));
        const products = ProductManager.getAllProducts();
        const product = products.find((p) => p.id === productId);

        if (product) {
          CartManager.addToWishlist(product, event);
          updateNavbar();
        }
      });
    });
}

window.addEventListener("resize",function(){
  
      renderRecommendedProducts();

})


// console.log(window.innerWidth)