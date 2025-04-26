import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { ReviewManager } from "./reviewManager.js"
import { UserManager} from "./userManager.js"

document.addEventListener("DOMContentLoaded", () => {
  const featuredProductsContainer = document.getElementById("featuredProducts");

  // Load and display featured products
  function loadFeaturedProducts() {
    let products = ProductManager.getAllProducts();

    products = products
      .filter((product) => product.isFeatured)
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);

    console.log(products);

    products.forEach((product, index) => {
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
        <button title="Quick View" class="btn btn-light btn-sm rounded-circle m-1"><i class="far fa-eye"></i></button>
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
        <span class="position-absolute top-50 start-50 translate-middle text-muted">|</span>
        <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
      </div>
    </div>
  </div>
`;
      featuredProductsContainer.appendChild(card);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        addToCart(product);
      });
    });

    // Add event listeners to "Add to Wishlist" buttons
  document.querySelectorAll('.add-to-wishlist').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const productId = parseInt(button.getAttribute('data-id'));
      const product = products.find(p => p.id === productId);
      if (product) {
        addToWishlist(product);
      }
    });
  });
  }

  // Function to add product to cart
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Format the product data to match what cart.js expects
    const cartItem = {
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`, // Fallback if no SKU
      price: product.discountedPrice || product.price,
      image: product.images ? product.images[0] : product.image, // Handle both formats
      quantity: 1
    };
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => 
      item.id === cartItem.id && item.sku === cartItem.sku && item.price === cartItem.price
    );
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show toast notification
    showToast(`${cartItem.name} added to cart!`);
  }
  // Function to add product to wishlist
  function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`,
      price: product.discountedPrice || product.price,
      image: product.images ? product.images[0] : product.image,
      quantity: 1
    };
    
    // Check if product already exists in wishlist
    const existingItemIndex = wishlist.findIndex(item => 
      item.id === wishlistItem.id && item.sku === wishlistItem.sku && item.price === wishlistItem.price
    );
    
    // Find the specific button that was clicked
    const wishlistButton = event.currentTarget;
    
    if (existingItemIndex !== -1) {
      // Remove from wishlist
      wishlist.splice(existingItemIndex, 1);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      showToast(`${wishlistItem.name} removed from wishlist!`);
      
      // Update button appearance
      wishlistButton.innerHTML = '<i class="far fa-heart"></i>';
      wishlistButton.classList.remove('btn-clicked');
      wishlistButton.classList.add('btn-light');
    } else {
      // Add to wishlist
      wishlist.push(wishlistItem);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      showToast(`${wishlistItem.name} added to wishlist!`);
      
      // Update button appearance
      wishlistButton.innerHTML = '<i class="fas fa-heart"></i>';
      wishlistButton.classList.remove('btn-light');
      wishlistButton.classList.add('btn-clicked');
    }
  }

  // Function to show toast notifications
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      console.error('Toast container not found');
      return;
    }
    
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">OmniShop</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 2000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

  // Initialize
  loadFeaturedProducts();

  // Counter Animation
  function animateCounter(counter, target, duration) {
    let start = 0;
    const increment = target / (duration / 50);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }

      if (target === 250000) {
        counter.textContent = Math.floor(start / 1000) + "k";
      } else {
        counter.textContent = Math.floor(start);
      }
    }, 50);
  }

  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    animateCounter(counter, target, 2000);
  });




//Dynamic categories in home page 

let categories = CategoryManager.getAllCategories();
let categoriesActiveSlide = document.getElementById("activeSlide");
let categoriesNextSlide = document.getElementById("nextSlide");

  
for (let i = 0; i < 4; i++) {

  let categoryId = categories[i].id;

  let productsOfCategory = ProductManager.getProductsByCategory(categoryId);
 
  
  
 
  

  categoriesActiveSlide.innerHTML +=
    `<div class="card cardItem p-0  position-relative  ">
          <img src="${categories[i].image}" class="rounded w-100 " alt="...">
    
          <div class="cardCaption position-absolute text-center">
            <h5 class="imgContainer text-light">${categories[i].name}</h5>
            <div class="cardDetails text-light">
              <p class="text-light ">${productsOfCategory.length} product</p>
              <button class=" btn p-3 btn-light ">View</button>
            </div>
          </div>
        </div>`; 
};


for (let i = 4; i < 8; i++) {


  let productId = categories[i].id;

  let productsOfCategory = ProductManager.getProductsByCategory(productId);


  

  categoriesNextSlide.innerHTML += ` <div class="card  cardItem  position-relative ">
          <img src="${categories[i].image}" class="rounded" alt="...">
    
          <div class="cardCaption position-absolute text-center">
            <h5 class="imgContainer text-light">${categories[i].name}</h5>
            <div class="cardDetails text-light ">
              <p class="text-light ">${productsOfCategory.length} product</p>
              <button class=" btn p-3 btn-light ">View</button>
            </div>
          </div>
        </div>`;
  
};
});







//Dynamic reviews in home page

let reviews = ReviewManager.getAllReviews();

let carouselAllReviews = document.getElementById("carouselAllReviews");

carouselAllReviews.innerHTML += `<div id="activeCarouselItem" class="carousel-item active  p-5 w-50 border border-3 m-auto bg-light "></div>`;

let activeCarouselItem = document.getElementById('activeCarouselItem');
let carouselItems = document.getElementsByClassName('carouselItems');




for (let index = 0; index < 5; index++) {
  if (index < reviews[0].rating) {
    
    activeCarouselItem.innerHTML += `<span> <i class="fa-solid fa-star text-warning"></i></span>`
  }
  else {
    activeCarouselItem.innerHTML += `<span> <i class="fa-solid fa-star "></i></span>`

  }
  
};


let activeReviewUserId = reviews[0].userId;
let activeReviewUserName= UserManager.getUserNameById(activeReviewUserId);




activeCarouselItem.innerHTML += `
                <p class="my-3 lead ">${reviews[0].comment}</p>
                <div class="d-flex justify-content-center">
                  <img class="rounded-circle"
                    src="https://websitedemos.net/flower-shop-04/wp-content/uploads/sites/1414/2023/10/testimonial-skip-01.jpg"
                    alt="">
                  <div class="ms-3">
                    <span>${activeReviewUserName}</span><br>
                    <span class="lead">Wedding Planner</span>
                  </div>
                </div>
              `;



for (let i = 1; i < reviews.length; i++) {
   
  let reviewUserId = reviews[i].userId;
  let reviewUserName= UserManager.getUserNameById(reviewUserId);

 carouselAllReviews.innerHTML += ` <div  class="carousel-item  carouselItems p-5 w-50 border border-3  m-auto bg-light "></div>`;
   for (let index = 0; index < 5; index++) {
   
     if (index < reviews[i].rating) {
    
        carouselItems[i-1].innerHTML +=`<span> <i class="fa-solid fa-star text-warning"></i></span>`
  }
  else {
        carouselItems[i-1].innerHTML +=`<span> <i class="fa-solid fa-star"></i></span>`

  }

   
};

carouselItems[i-1].innerHTML += `<p class="my-3 lead ">${reviews[i].comment}</p>
                <div class="d-flex justify-content-center">
                  <img class="rounded-circle"
                    src="https://websitedemos.net/flower-shop-04/wp-content/uploads/sites/1414/2023/10/testimonial-skip-01-1.jpg"
                    alt="">
                  <div class="ms-3">
                    <span>${reviewUserName} </span><br>
                    <span class="lead">Designer </span>
                  </div>
        
                </div>`;

  
}







   
              













