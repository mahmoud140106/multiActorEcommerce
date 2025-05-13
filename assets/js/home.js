import { ProductManager } from "./productManager.js";
import { CategoryManager } from "./categoryManager.js";
import { ReviewManager } from "./reviewManager.js";
import { UserManager } from "./userManager.js";
import { CartManager } from "./cartManager.js";
import { updateNavbar } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const featuredProductsContainer = document.getElementById("featuredProducts");

  // console.log(ReviewManager.getAllReviews());
  // console.log(UserManager.getAllUsers());

  // Load and display featured products
// Load and display featured products
function loadFeaturedProducts() {
  let products = ProductManager.getAllProducts();

  products = products
    .filter((product) => product.isFeatured && product.stock > 0)
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  // console.log(products);

  products.forEach((product, index) => {
    // console.log("object", CategoryManager.getCategory(product.categoryId));
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
    featuredProductsContainer.appendChild(card);
  });

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);
      CartManager.addToCart(product);
      updateNavbar();
    });
  });

  // Add event listeners to "Add to Wishlist" buttons
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(button.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);
      if (product) {
        CartManager.addToWishlist(product, event);
        updateNavbar();
      }
    });
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

  let target = parseInt(UserManager.getAllUsers().length);
  animateCounter(counters[0], target, 1000);

  target = parseInt(ReviewManager.getAllReviews().length);
  animateCounter(counters[1], target, 1000);

  target = parseInt(CategoryManager.getAllCategories().length);
  animateCounter(counters[2], target, 1000);

  // counters.forEach((counter) => {
  //   const target = parseInt(ReviewManager.getAllReviews().length);
  //   animateCounter(counter, target, 2000);
  // });

  //Dynamic categories in home page
  function renderCategorySlides() {
    const categories = CategoryManager.getAllCategories();
    const showCategories = document.getElementById("showCategories");
  
    let cardsPerSlide = 1;
    const width = window.innerWidth;
  
    if (width >= 950) {
      cardsPerSlide = 4;
    } else if (width >= 768) {
      cardsPerSlide = 2;
    } else {
      cardsPerSlide = 1;
    }
  
    let slidesHTML = "";
    let totalSlides = Math.ceil(categories.length / cardsPerSlide);
  
    for (let i = 0; i < totalSlides; i++) {
      const start = i * cardsPerSlide;
      const end = start + cardsPerSlide;
      const slideItems = categories.slice(start, end);
  
      let cardsHTML = slideItems
        .map((cat) => {
          const products = ProductManager.getProductsByCategory(cat.id);
          return `
            <div class="col h-100 d-flex justify-content-center">
              <div class="card cardItem w-100 h-100">
                <img src="${cat.image}" class="rounded w-100"  alt="${cat.name}">
                <div class="cardCaption position-absolute text-center">
                  <h5 class="imgContainer text-light">${cat.name}</h5>
                  <div class="cardDetails text-light">
                    <p>${products.length} product</p>
                    <button class="btn btn-light viewProductsOfCategory" value="${cat.name}">View</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
  
      slidesHTML += `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
          <div class="row justify-content-center gap-3">
            ${cardsHTML}
          </div>
        </div>
      `;
    }
  
    showCategories.innerHTML = slidesHTML;
  }
  
  // Run on page load
  renderCategorySlides();
  
  // Run again on resize (with slight delay)
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      renderCategorySlides();
    }, 300);
  });
  

  function renderReviewSection() {
    let reviews = ReviewManager.getAllReviews();
    let carouselAllReviews = document.getElementById("carouselAllReviews");
    carouselAllReviews.innerHTML += `<div id="activeCarouselItem" class=" carousel-item active p-5 m-auto bg-light"></div>`;
    let activeCarouselItem = document.getElementById("activeCarouselItem");

    for (let index = 0; index < 5; index++) {
      if (index < reviews[0].rating) {
        activeCarouselItem.innerHTML += `<span><i class="fa-solid fa-star text-warning"></i></span>`;
      } else {
        activeCarouselItem.innerHTML += `<span><i class="fa-solid fa-star"></i></span>`;
      }
    }

    let activeReviewUserId = reviews[0].userId;
    let activeReviewUserName = UserManager.getUserNameById(activeReviewUserId);
    let activeUserImg = UserManager.getUser(activeReviewUserId);
    // console.log(activeUserImg.profilePicture);

    if (activeUserImg.profilePicture == "") {
      activeUserImg.profilePicture =
        "https://static.vecteezy.com/system/resources/previews/023/932/501/original/anonymous-personal-icon-png.png";
    }

    activeCarouselItem.innerHTML += `
  <p class="my-3 lead">${reviews[0].comment.slice(0, 100)}...</p>
  <div class="d-flex justify-content-center">
    <img class="rounded-circle "
      src="${activeUserImg.profilePicture}"
      alt="">
    <div class="ms-3 d-flex align-items-center">
      <span>${activeReviewUserName}</span><br>
    </div>
  </div>
`;

    let reviewLength = reviews.length;
    for (let index = 1; index < reviewLength; index++) {
      carouselAllReviews.innerHTML += `<div class="carousel-item carouselItems p-5   m-auto bg-light"></div>`;
    }

    let carouselItems = document.getElementsByClassName("carouselItems");

    for (let i = 1; i < reviewLength; i++) {
      let reviewUserId = reviews[i].userId;
      let reviewUserName = UserManager.getUserNameById(reviewUserId);

      let UserImg = UserManager.getUser(reviewUserId);
      // console.log(UserImg);

      if (!UserImg.profilePicture) {
        UserImg.profilePicture =
          "https://static.vecteezy.com/system/resources/previews/023/932/501/original/anonymous-personal-icon-png.png";
      }

      for (let index = 0; index < 5; index++) {
        if (index < reviews[i].rating) {
          carouselItems[
            i - 1
          ].innerHTML += `<span><i class="fa-solid fa-star text-warning"></i></span>`;
        } else {
          carouselItems[
            i - 1
          ].innerHTML += `<span><i class="fa-solid fa-star"></i></span>`;
        }
      }

      carouselItems[i - 1].innerHTML += `
    <p class="my-3 lead">${reviews[i].comment.slice(0, 100)}...</p>
    <div class="d-flex justify-content-center">
      <img class="rounded-circle"
        src="${UserImg.profilePicture}"
        alt="">
      <div class="ms-3 d-flex align-items-center">
        <span >${reviewUserName}</span><br>
      </div>
    </div>
  `;
    }
  }

  renderCategorySlides();
  renderReviewSection();

  window.addEventListener("resize", () => {
    renderCategorySlides();
  });

  // Update wishlist button state for featured products on the home page
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    const productId = parseInt(button.getAttribute("data-id"));
    CartManager.isProductInWishlist(productId, button);
  });
});
//   // for (let i = 0; i < 4; i++) {

//   //   let categoryId = categories[i].id;

//   //   let productsOfCategory = ProductManager.getProductsByCategory(categoryId);

//   // }

//   // for (let i = 4; i < 8; i++) {
//   //   let productId = categories[i].id;
//   //   let productsOfCategory = ProductManager.getProductsByCategory(productId);

//   //   categoriesNextSlide.innerHTML +=
//   //     `<div class="card cardItem position-relative col-12 col-sm-6 col-lg-3 ">
//   //         <img src="${categories[i].image}" class="rounded" alt="...">

//   //         <div class="cardCaption position-absolute text-center">
//   //           <h5 class="imgContainer text-light">${categories[i].name}</h5>
//   //           <div class="cardDetails text-light">
//   //             <p class="text-light">${productsOfCategory.length} product</p>
//   //             <button class="btn p-3 btn-light viewProductsOfCategory"  value="${categories[i].name}">View</button>
//   //           </div>
//   //         </div>
//   //       </div>`;
//   // }
// });

// //Dynamic reviews in home page
// // let reviews = ReviewManager.getAllReviews();
// // let carouselAllReviews = document.getElementById("carouselAllReviews");

// // carouselAllReviews.innerHTML += `<div id="activeCarouselItem" class="carousel-item active p-5 border border-3 m-auto bg-light"></div>`;

// // let activeCarouselItem = document.getElementById('activeCarouselItem');
// // let carouselItems = document.getElementsByClassName('carouselItems');

// // for (let index = 0; index < 5; index++) {
// //   if (index < reviews[0].rating) {
// //     activeCarouselItem.innerHTML += `<span><i class="fa-solid fa-star text-warning"></i></span>`;
// //   } else {
// //     activeCarouselItem.innerHTML += `<span><i class="fa-solid fa-star"></i></span>`;
// //   }
// // }

// // let activeReviewUserId = reviews[0].userId;
// // let activeReviewUserName = UserManager.getUserNameById(activeReviewUserId);

// // activeCarouselItem.innerHTML += `
// //   <p class="my-3 lead">${reviews[0].comment.slice(0,100)}</p>
// //   <div class="d-flex justify-content-center">
// //     <img class="rounded-circle"
// //       src="https://websitedemos.net/flower-shop-04/wp-content/uploads/sites/1414/2023/10/testimonial-skip-01.jpg"
// //       alt="">
// //     <div class="ms-3">
// //       <span>${activeReviewUserName}</span><br>
// //       <span class="lead">Wedding Planner</span>
// //     </div>
// //   </div>
// // `;

// // for (let i = 1; i < reviews.length; i++) {
// //   let reviewUserId = reviews[i].userId;
// //   let reviewUserName = UserManager.getUserNameById(reviewUserId);

// //   carouselAllReviews.innerHTML += `<div class="carousel-item carouselItems p-5  border border-3 m-auto bg-light"></div>`;

// //   for (let index = 0; index < 5; index++) {
// //     if (index < reviews[i].rating) {
// //       carouselItems[i-1].innerHTML += `<span><i class="fa-solid fa-star text-warning"></i></span>`;
// //     } else {
// //       carouselItems[i-1].innerHTML += `<span><i class="fa-solid fa-star"></i></span>`;
// //     }
// //   }

// //   carouselItems[i-1].innerHTML += `
// //     <p class="my-3 lead">${reviews[i].comment.slice(0,100)}</p>
// //     <div class="d-flex justify-content-center">
// //       <img class="rounded-circle"
// //         src="https://websitedemos.net/flower-shop-04/wp-content/uploads/sites/1414/2023/10/testimonial-skip-01-1.jpg"
// //         alt="">
// //       <div class="ms-3">
// //         <span>${reviewUserName}</span><br>
// //         <span class="lead">Designer</span>
// //       </div>
// //     </div>
// //   `;
// // }

// search about product through home

// document.getElementById("searchGo").addEventListener("click", function (e) {

//   let searchInputData = document.getElementById("searchInput").value;

//   window.location.href = `../../customer/product.html?products$${searchInputData.toLowerCase()}`;

// })

// viewAll Products Of specific Category through Home

document.addEventListener("DOMContentLoaded", function () {
  let viewAllProductsOfCategory = document.getElementsByClassName(
    "viewProductsOfCategory"
  );

  for (let i = 0; i < viewAllProductsOfCategory.length; i++) {
    viewAllProductsOfCategory[i].addEventListener("click", function (e) {
      window.location.href = `../../customer/product.html?categoryType=${e.target.value}`;
    });
  }
});

// view All Categories through Home

document
  .getElementById("viewCategories")
  .addEventListener("click", function (e) {
    // console.log(e);

    window.location.href = "/customer/categories.html";
  });

let btnShopNow = document.getElementsByClassName("ShopNow");
for (let index = 0; index < btnShopNow.length; index++) {
  btnShopNow[index].addEventListener("click", function () {
    window.location.href = "../../customer/product.html";
  });
}

document.getElementById("learnMore").addEventListener("click", function () {
  window.location.href = "../../customer/categories.html";
});
