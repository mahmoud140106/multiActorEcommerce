import { ProductManager } from "./productManager.js";
let allProduct = ProductManager.getAllProducts();
let productPage = document.getElementById("productPage");


console.log(allProduct);



for (let i = 0; i < allProduct.length; i++) {

    


    productPage.innerHTML += ` <div class="product-card " data-price="600" data-best-seller="false">
        <div class="product-image" id="img1">
          <img src="${allProduct[i].images[0]}" alt="" style="width: 200px;">
        </div>

        <ul class="card-action-list">

            <li class="card-action-item">
              <button class="card-action-btn" aria-labelledby="card-label-1">
                <ion-icon name="cart-outline"><i class="fa-solid fa-cart-shopping"></i></ion-icon>
              </button>

              <div class="card-action-tooltip" id="card-label-1">Add to Cart</div>
            </li>

            <li class="card-action-item">
              <button class="card-action-btn" aria-labelledby="card-label-2">
                <ion-icon class="heart-outline"><i class="fa-solid fa-heart"></i></ion-icon>
              </button>

              <div class="card-action-tooltip" id="card-label-2">Add to Whishlist</div>
            </li>

            <li class="card-action-item">
              <button class="card-action-btn" aria-labelledby="card-label-3">
                <ion-icon class="eye-outline"><i class="fa-solid fa-eye"></i></ion-icon>
              </button>

              <div class="card-action-tooltip" id="card-label-3">Quick View</div>
            </li>
          

           

          </ul>
          <div class="price text-center">
            <del class="del">${allProduct[i].price + allProduct[i].discountedPrice}</del>

            <span class="span">${allProduct[i].price}</span>
          </div>

          <h3 class="text-center">
            <a href="#" class="card-title">${allProduct[i].name}</a>
          </h3>

          <div class="card-rating text-center">

            <div class="rating-wrapper" aria-label="5 start rating">
              <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
              <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
              <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
              <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
              <ion-icon name="star" aria-hidden="true"><i class="fa-solid fa-star"></i></ion-icon>
            </div>

            <p class="rating-text">5170 reviews</p>

          </div>

        </div>`;

    
    
}