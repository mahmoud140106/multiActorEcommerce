import { CategoryManager } from "./categoryManager.js";
import { ProductManager } from "./productManager.js";
import { StorageManager } from "./storageManager.js";
import { showToast } from "./toast.js";
import { CartManager } from "./cartManager.js";

let user = StorageManager.load("currentUser"); // Get current user from storage
let productId;
let AllProducts;
let r;
let productCount;
document.addEventListener("DOMContentLoaded", () => {
  console.log("product details.js loaded");
  try {
    const urlParams = new URLSearchParams(window.location.search);
    productId = parseInt(urlParams.get("id"));
    productCount = document.getElementById("productCount").value;
    AllProducts = ProductManager.getAllProducts();
   
    if (isNaN(productId)) {
      console.error("Invalid product ID:", urlParams.get("id"));
      document.querySelector(".container.mt-4").innerHTML =
        "<p>Invalid product ID.</p>";
      return;
    }

    const product = ProductManager.getProduct(productId);
    
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
    document.getElementById("price").textContent = product.discountedPrice
      ? `$${product.discountedPrice.toFixed(2)}`
      : `$${product.price.toFixed(2)}`;
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

    // set recommendation products
    const carouselrecommendationInner = document.getElementById(
      "carouselrecommendationInner"
    );
    carouselrecommendationInner.innerHTML = "";

    for (let j = 0; j < 2; j++) {
      const carouselItem = document.createElement("div");
      carouselItem.className = `carousel-item ${j === 0 ? "active" : ""}`;
      let table = document.createElement("table");
      let tr = document.createElement("tr");
      let td;
      for (let i = 0; i < 4; i++) {
        r = Math.floor(Math.random() * AllProducts.length);
        if (!AllProducts[r].images || AllProducts[r].images.length === 0) {
          console.warn("No images found for product:", AllProducts[r].id);
          carouselrecommendationInner.innerHTML = `
    <div class="carousel-item active">
      <img src="https://dummyimage.com/500x250/cccccc/000000&text=No+Image" class="d-block w-100" alt="No Image" style="height: 250px; object-fit: cover;">
    </div>
  `;
        } else {
          // Carousel recommendation item

          td = document.createElement("td");

          td.innerHTML = `
   
            <div class="card " >
                <img src="${AllProducts[r].images[0]}" class="cursol-img card-img-top d-block w-100" alt="No Image" style="height: 250px;  object-fit: cover;"  product-id='${AllProducts[r].id}'>
                <div id ="wishlist-html" class="card-icons position-absolute top-0 end-0 p-2 d-flex flex-column">
                  <button title="Add to Wishlist" class="add-to-wishlist btn btn-light btn-sm rounded-circle m-1" data-id="${AllProducts[r].id}"><i class="far fa-heart"></i></button>
                  <button title="Add to Cart" class="btn btn-light btn-sm rounded-circle m-1"><i class="fas fa-shopping-cart"></i></button>
                </div>
            </div>
            <div class="RecomndProduct-name">${AllProducts[r].name}</div>
            <div class="RecomndProduct-price text-muted" >$${AllProducts[r].price}</div>
         
    `;
          tr.appendChild(td);
        }
      }
      table.appendChild(tr);
      carouselItem.appendChild(table);
      carouselrecommendationInner.appendChild(carouselItem);
    }
  } catch (error) {
    console.error("Error loading product details:", error);
    document.querySelector(".container.mt-4").innerHTML =
      "<p>Error loading product details.</p>";
  }
  document.querySelectorAll(".cursol-img").forEach((img) =>
    img.addEventListener("click", function () {
      const id = img.getAttribute("product-id");
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
}

document
  .getElementById("descriptionBtn")
  .addEventListener("click", showDescription);

function showDescription() {
  //show description section
  let descriptionSection = document.getElementById("descriptionSection");
  descriptionSection.classList.remove("d-none");
  reviewSection.classList.add("d-none");
}

//add to cart function
document.getElementById("addTocart").addEventListener("click", function () {
  if (user == null) {
    showToast("Please log in first", "error");
    return;
  }
});

// Redirect to checkout page when "Buy It Now" is clicked
document.getElementById("buyItNow").addEventListener("click", function () {
  if (user == null) {
    showToast("Please log in first", "error");
    return;
  }
  window.location.href = `checkout.html?id=${productId}&count=${productCount} `; // Redirect to checkout page with product ID
});
