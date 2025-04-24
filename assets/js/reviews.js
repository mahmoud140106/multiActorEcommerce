import { ReviewManager } from "./reviewManager.js";
import { StorageManager } from "./storageManager.js";
let reviewsList;
window.addEventListener('load', () =>{
let productId = new URLSearchParams(window.location.search).get('id'); // Get product ID from URL
getreviews(productId); // Get reviews for the product
removeHighlight(); // Remove highlight from stars

}); //end of load



//get reviews for the product
function getreviews(productId){

  reviewsList= document.getElementById("reviewsList");
  document.getElementById("reviewsList").textContent = ""; // Clear previous reviews
 let reviews = ReviewManager.getReviewsByProduct(productId); // Get reviews for the product
 if (reviews.length == 0) {
    
     reviewsList.textContent = "No reviews available for this product yet." ;
     return;
   }

  //  reviews.forEach((review,index) => {
    // Carousel item
  //   const carouselItem = document.createElement("div");
  //   carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
  //   carouselItem.innerHTML = `
    
  //                 <div class="carousel-item active  p-5 col-lg-12 border border-3 m-auto bg-light " 
  //                  style="width: 400px; position: relative;right: 200px;">
                          
  //                         <p class="my-3 lead "> </p>
  //                         <div class="d-flex justify-content-center">
                           
  //                           <div class="ms-3">
  //                             <span></span><br>
  //                             <span class="lead"></span>
  //                           </div>
  //                         </div>
  //                   </div>



    
  //   `;
  //   reviewsList.appendChild(carouselItem);
  // });

 reviews.forEach(review=>{
     reviewsList.innerHTML += `
     <div class="review-item">
        
         <li>${review.comment} ${review.rating}  <i class="fa-solid fa-star starRating " ></i>
         </li>
      </div>
     
     `
  
 })
 

}



//add review to reviews list
document.getElementById('submitBtn').addEventListener('click', addReview); 

function addReview(){              
    let user = StorageManager.load("currentUser"); // Get current user from storage
    let ratingValue = document.querySelectorAll('.star.selected').length; // Get selected rating value
    if(user==null){
      location.href = "/index.html"; // Redirect to login page if user is not logged in
      alert("Please login to add a review.");
      return;
    }
    let reviewComment= document.getElementById('reviewInput').value ;
    ReviewManager.addReview(productId.value,user.id,ratingValue,reviewComment); // Add review to storage
    getreviews(productId.value); // Refresh reviews list
  

 

  
  document.getElementById('reviewInput').value = '';
}

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
    // addReview(star.getAttribute('data-value'));
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

