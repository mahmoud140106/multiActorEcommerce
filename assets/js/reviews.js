import { ReviewManager } from "./reviewManager.js";
import { StorageManager } from "./storageManager.js";
import { CartManager } from "./cartManager.js";

let reviews;
let productId;
window.addEventListener('load', () =>{
  try {
    const urlParams = new URLSearchParams(window.location.search);
     productId = parseInt(urlParams.get("id"));

    if (isNaN(productId)) {
      console.error("Invalid product ID:", urlParams.get("id"));
      document.querySelector(".container.mt-4").innerHTML = "<p>Invalid product ID.</p>";
      return;
    }

let Allreviews = StorageManager.load('reviews');
reviews=Allreviews.filter((review) => review.productId === productId);
// reviews = ReviewManager.getReviewsByProduct(productId); // Get reviews for the product
console.log(reviews)

getreviews(productId); // Get reviews for the product
removeHighlight(); // Remove highlight from stars
  }catch (error) {
    console.error("Error loading product details:", error);
    document.querySelector(".container.mt-4").innerHTML = "<p>Error loading product details.</p>";
  }
}); //end of load



//get reviews for the product
function getreviews(productId){

  
 // Render carousel images dynamically
 const carouselReviews = document.getElementById("carouselReviews");
//  carouselReviews.innerHTML = "";

 if (!reviews || reviews.length  === 0) {
  console.warn("No reviews found for product:", productId);
  carouselReviews.innerHTML = `
    <div class="carousel-item active">
    <p> "No reviews available for this product yet."</p>
    </div>
  `;
} 
else{
 reviews.forEach((review, index) => {
  // Carousel item
  const carouselItem = document.createElement("div");
  carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

  let divReviewItem = document.createElement("div");
  divReviewItem.className = "review-item";
  let ratingStarsSpan = document.createElement("span");

  for (let i = 0; i < review.rating; i++) {
    let star = document.createElement("i");
    star.className = "fa-solid fa-star starRating"; // Create star element
    ratingStarsSpan.appendChild(star); // Append star to the span
  }
  let reviewComment = document.createElement("p");
  reviewComment.textContent = review.comment; // Set review comment

  let reviewUser = document.createElement("strong");
 let userId= review.userId;
 let user = StorageManager.load("users").find(user => user.id === userId); // Find user by ID
  reviewUser.textContent = user ? user.userName : "Unknown User"; // Set review user name

divReviewItem.appendChild(ratingStarsSpan); // Append stars to review item
divReviewItem.appendChild(reviewComment); // Append review comment to review item
divReviewItem.appendChild(reviewUser); // Append review user name to review item

  carouselItem.appendChild(divReviewItem); // Append review item to carousel item
  carouselReviews.appendChild(carouselItem); // Append carousel item to carousel reviews
     
  
 });
}



 

}



//add review to reviews list
document.getElementById('submitBtn').addEventListener('click', function (){              
    let user = StorageManager.load("currentUser"); // Get current user from storage
    let ratingValue = document.querySelectorAll('.star.selected').length; // Get selected rating value
    if(user==null){
         CartManager.showToast("Please log in first")
      return;
    }
    if(ratingValue<1){
      CartManager.showToast("Rating must be between 1 and 5 stars.")
      return;
    }
    let reviewComment= document.getElementById('reviewInput').value ;
    ReviewManager.addReview(productId,user.id,ratingValue,reviewComment); // Add review to storage
    getreviews(productId); // Refresh reviews list
  

  document.getElementById('reviewInput').value = '';
});


// Stars Rating system

const stars = document.querySelectorAll('.star');

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const value = star.getAttribute('data-value');
    highlightStars(value);
  });

  // star.addEventListener('mouseout', () => {
  //   removeHighlight();
  // });

  star.addEventListener('click', () => {
    setRating(star.getAttribute('data-value'));
  });
});

function highlightStars(value) {
  stars.forEach(star => {
    if (star.getAttribute('data-value') <= value) {
      star.classList.add('selected');
    } 
    else {
      star.classList.remove('selected');
    }
  });
}

function removeHighlight() {
  stars.forEach(star => {
    star.classList.remove('selected');
  });
}

function setRating(value) {
  stars.forEach(star => {
    if (star.getAttribute('data-value') <= value) {
      star.classList.add('selected');
    } 
    else {
      star.classList.remove('selected');
    }
  });
}

