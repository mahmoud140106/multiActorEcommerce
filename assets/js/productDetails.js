import { ProductManager } from "./productManager.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));

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
    document.getElementById("category").textContent = `Category: ${product.category || "N/A"}`;
    document.getElementById("price").textContent = product.discountedPrice
      ? `$${product.discountedPrice.toFixed(2)}`
      : `$${product.price.toFixed(2)}`;
    document.getElementById("sizes").textContent = product.sizes?.length
      ? product.sizes.join(", ")
      : "N/A";
    document.getElementById("description").textContent = product.description || "No description available";

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
});


document.getElementById('reviewsBtn').addEventListener('click', showReviews); //show reviews section


function showReviews(){                //show reviews section
  let reviewSection = document.getElementById('reviewSection');
  reviewSection.classList.toggle( 'd-none');
}


document.getElementById('submitBtn').addEventListener('click', addReview); //add review to reviews list
function addReview(){              

  // validate name and email
  let name = document.getElementById('nameInput').value;
  
  if(!/^[A-Za-z\s]{3,}$/.test(name)) {
      alert('Please enter a valid name with at least 3 characters.');
      return;
  }
  let email = document.getElementById('emailInput').value;
  if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
  }
  
  //add review to reviews list

  let review = document.getElementById('reviewInput').value;  
  let li = document.createElement('li');  
  li.innerText = review;
  let reviewsList = document.getElementById('reviewsList');  
  reviewsList.appendChild(li);

      //clear input fields

  document.getElementById('nameInput').value = '';  
  document.getElementById('emailInput').value = '';
  document.getElementById('reviewInput').value = '';
}
