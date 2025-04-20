// assets/js/home.js
import { ProductManager } from "./productManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const featuredProductsContainer = document.getElementById("featuredProducts");

  // Load and display featured products
  function loadFeaturedProducts() {
    let products = ProductManager.getAllProducts();

    products = products
      .filter((product) => product.isFeatured)
      .sort(() => 0.5 - Math.random())
      // .slice(0, 4);   

      console.log(products)
    products.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card position-relative mx-5 mx-md-0">
          <div class="position-relative imgcontainer">
       
            <img src="${product.image}" class="card-img-top" alt="${
        product.name
      }" style="height: 300px; object-fit: cover;" onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
          
            <div class="card-icons position-absolute top-0 end-0 p-2">
              <button class="btn btn-light btn-sm rounded-circle m-1"><i class="far fa-heart"></i></button>
              <button class="btn btn-light btn-sm rounded-circle m-1"><i class="far fa-eye"></i></button>
              <button class="btn btn-light btn-sm rounded-circle m-1"><i class="fas fa-shopping-cart"></i></button>
            </div>
            ${
              product.isOnSale
                ? '<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">SALE</span>'
                : ""
            }
          </div>
          <div class="card-body p-0 my-3 text-center">
            <h5 class="card-title mb-1">${product.name}</h5>
            <p class="card-text text-secondary mb-2">${product.category}</p>
            <div class="p-3 border-top position-relative  border-1 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center ">
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
            <button class=" add-to-cart " onclick="addToCart(${
              product.id
            })">Add to cart</button>
            </div>
            </div>
        </div>
      `;
      featuredProductsContainer.appendChild(card);
    });
  }

  // Initialize
  loadFeaturedProducts();
});
