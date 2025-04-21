
window.onload = function() {
async function fetchProducts() {         //fetch products from json file

    let response = await fetch('clothes_data.json');
    let Productsdata = await response.json();
    localStorage.setItem('products', JSON.stringify(Productsdata)); 
}


fetchProducts();                                            //call the function to fetch products
let productId = window.location.search.split('=')[1];      //get product id from url
document.getElementById('productId').setAttribute('value' , `${productId}`);  //send product id to hidden input field to send with the count to cart in url
let jsonProducts = localStorage.getItem('products');     //get products from local storage
let products = JSON.parse(jsonProducts);
let product= products.find((product) => product.id == productId);   //find product by id

//display product details

document.getElementById('productName').innerText = product.name;
document.getElementById("category").innerText += product.category;
document.getElementById('price').innerText =` ${product.price} $ `;
document.getElementById('size').innerText = product.size;
document.getElementById('gender').innerText +=  product.gender;
document.getElementById('description').innerText = product.description;
product.image.forEach((image , index ) => {
  document.querySelectorAll(`.img${index + 1}`)[0].src = `${image}`;
  document.querySelectorAll(`.img${index + 1}`)[0].alt = `${product.name}`;
  document.querySelectorAll(`.img${index + 1}`)[0].title = `${product.name} Image${index + 1}`;

  document.querySelectorAll(`.img${index + 1}`)[1].src = `${image}`;
  document.querySelectorAll(`.img${index + 1}`)[1].alt = `${product.name}`;
  document.querySelectorAll(`.img${index + 1}`)[1].title = `${product.name} Image${index + 1}`;

   
});
//handle active thumbnail
const thumbnails = document.querySelectorAll(".imglabel img"); 

    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            // Remove active class from all
           thumbnails.forEach(img => img.classList.remove("active-thumbnail"));

            // Add to clicked one
            thumb.classList.toggle("active-thumbnail");

            
        });
    });
  
    

   
}//end of load


// Back to home page
function redirectToHome(){
    window.location.href = "index.html";
}

function showReviews(){                //show reviews section
    let reviewSection = document.getElementById('reviewSection');
    reviewSection.classList.toggle( 'd-none');
}

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

    review = document.getElementById('reviewInput').value;  
    let li = document.createElement('li');  
    li.innerText = review;
    let reviewsList = document.getElementById('reviewsList');  
    reviewsList.appendChild(li);

        //clear input fields

    document.getElementById('nameInput').value = '';  
    document.getElementById('emailInput').value = '';
    document.getElementById('reviewInput').value = '';
}
