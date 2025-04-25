import { CategoryManager } from "./categoryManager.js";
import { ProductManager } from "./productManager.js";
let productId;
document.addEventListener("DOMContentLoaded", () => {
  console.log("product details.js loaded");
  try {
    const urlParams = new URLSearchParams(window.location.search);
     productId = parseInt(urlParams.get("id"));

    if (isNaN(productId)) {
      console.error("Invalid product ID:", urlParams.get("id"));
      document.querySelector(".container.mt-4").innerHTML = "<p>Invalid product ID.</p>";
      return;
    }

    const product = ProductManager.getProduct(productId);
    if (!product) {
      console.error("Product not found for ID:", productId);
      document.querySelector(".container.mt-4").innerHTML = "<p>Product not found.</p>";
      return;
    }

    // Set product details
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").textContent = product.name || "Unknown Product";
    document.getElementById("category").textContent = `Category: ${CategoryManager.getCategory(product.categoryId).name || "N/A"}`;
    document.getElementById("price").textContent = product.discountedPrice
      ? `$${product.discountedPrice.toFixed(2)}`
      : `$${product.price.toFixed(2)}`;
    // document.getElementById("sizes").textContent = product.sizes?.length
    //   ? product.sizes.join(", ")
    //   : "N/A";
      // document.getElementById("sku").textContent = product.sku || "N/A";
    document.getElementById("descriptionSection").innerHTML += `<br/> ${product.description}
    
    <br/> <strong>Brand:</strong> ${product.brand || "N/A"}   
    <br/> <strong>Colors:</strong> ${product.colors?.length ? product.colors.join(", ") : "N/A"}`
     || "No description available";

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
          <img src="${image}" class="d-block w-100" alt="${product.name || "Product"}" style="height: 100%; object-fit: cover;" 
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
          <img src="${image}" alt="${product.name || "Product"}" style="height: 80px; width: 80px; object-fit: cover;" 
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
    document.querySelector(".container.mt-4").innerHTML = "<p>Error loading product details.</p>";
  }

  let stockCount = Math.floor(Math.random() * 10) + 1;
document.getElementById("stockCount").textContent= `${stockCount} in stock` // Random stock count between 1 and 100
document.querySelector(".styled-slider").style.background =`linear-gradient(to right, #d49117 ${stockCount*10}%, #e0e0e0 ${30}%)`;
});  //end of load 


document.getElementById('reviewsBtn').addEventListener('click', showReviews); //show reviews section


function showReviews(){                //show reviews section
  let reviewSection = document.getElementById('reviewSection');
  reviewSection.classList.remove( 'd-none');
  descriptionSection.classList.add( 'd-none');
}

document.getElementById('descriptionBtn').addEventListener('click', showDescription); 


function showDescription(){                //show description section
  let descriptionSection = document.getElementById('descriptionSection');
  descriptionSection.classList.remove( 'd-none');
  reviewSection.classList.add( 'd-none');
}



document.getElementById("buyItNow").addEventListener("click", redirectToChechout); // Redirect to checkout page when "Buy It Now" is clicked
function redirectToChechout(){
  window.location.href = "checkout.html?id=" + productId; // Redirect to checkout page with product ID
}

