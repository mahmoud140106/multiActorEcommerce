import { ReviewManager } from "./reviewManager.js";
let reviewsList;
window.addEventListener('load', () =>{
let productId = new URLSearchParams(window.location.search).get('id'); // Get product ID from URL
 reviewsList= document.getElementById("reviewsList");
let reviews = ReviewManager.getReviewsByProduct(productId); // Get reviews for the product
console.log(reviews); // Log reviews to console for debugging
if (reviews.length == 0) {
   
    reviewsList.textContent = "No reviews available for this product yet." ;
    return;
  }
  
reviews.forEach(review=>{
    reviewsList.innerHTML += `
    <div class="review-item">
        <div class="review-header">
            <strong>User ID:</strong> ${review.userId} | 
            <strong>Rating:</strong> ${review.rating} Stars | 
            <strong>Date:</strong> ${new Date(review.createdAt).toLocaleDateString()}
        </div>
        <div class="review-body">
            <p>${review.comment}</p>
        </div>

     </div>
    
    `
})

}); //end of load

document.getElementById('submitBtn').addEventListener('click', addReview); //add review to reviews list
function addReview(){              
    let user
    ReviewManager.addReview(productId,)
 
  
  //add review to reviews list

  let review = document.getElementById('reviewInput').value;  
//   review.forEach((image, index) => {
//     // Carousel item
//     const carouselItem = document.createElement("div");
//     carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
//     carouselItem.innerHTML = `
//       <img src="${image}" class="d-block w-100" alt="${product.name || "Product"}" style="height: 100%; object-fit: cover;" 
//            onerror="this.src='https://dummyimage.com/500x250/cccccc/000000&text=No+Image';">
//     `;
//     carouselImages.appendChild(carouselItem);
//   reviewsList.appendChild(li);

      //clear input fields

  document.getElementById('nameInput').value = '';  
  document.getElementById('emailInput').value = '';
  document.getElementById('reviewInput').value = '';
}
