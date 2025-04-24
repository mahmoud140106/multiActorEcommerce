import { UserManager } from "./userManager.js";
import { StorageManager } from "./storageManager.js";
import { CategoryManager} from "./categoryManager.js";

(function initializeDefaultAdmin() {
  UserManager.initializeDefaultAdmin();
})();    

// Protect routes
function restrictAccess() {
  const currentUser = StorageManager.load("currentUser");
  const currentPath = window.location.pathname;
  console.log("restrictAccess - Current User:", currentUser);
  console.log("restrictAccess - Current Path:", currentPath);
  const allowedPaths = {
    customer: [
      "/index.html",
      "/customer/catalog.html",
      "/customer/categories.html",
      "/customer/cart.html",
      "/customer/productDetails.html",
      "/customer/profile.html",
      "/customer/checkout.html",
    ],
    seller: [
      "/index.html",
      "/seller/dashboard.html",
      "/seller/products.html",
      "/orders.html",
    ],
    admin: ["/index.html", "/admin/dashboard.html", "/admin/products.html"],
    guest: [
      "/index.html",
      "/customer/catalog.html",
      "/customer/productDetails.html",
      "/customer/categories.html",
    ],
  };

  if (currentUser) {
    const userRole = currentUser.role;
    if (!allowedPaths[userRole].includes(currentPath)) {
      if (userRole === "customer") {
        window.location.href = "/index.html";
      } else if (userRole === "seller") {
        window.location.href = "/seller/dashboard.html";
      } else if (userRole === "admin") {
        window.location.href = "/admin/dashboard.html";
      }
    }
  } else {
    if (!allowedPaths.guest.includes(currentPath)) {
      window.location.href = "/index.html";
    }
  }
}

export function updateNavbar() {
  console.log("updateNavbar: Starting execution");
  const currentUser = StorageManager.load("currentUser");
  const navLinks = document.querySelector(".navbar-nav");
  const heroSection = document.querySelector("#hero-section");

  console.log("updateNavbar - Current User:", currentUser);
  console.log("updateNavbar - Nav Links Element:", navLinks);
  console.log("updateNavbar - Current Path:", window.location.pathname);

  if (!navLinks) {
    console.error("updateNavbar: .navbar-nav element not found!");
    return;
  }

  navLinks.innerHTML = ""; 
  if (currentUser && currentUser.role) {
    console.log("updateNavbar: Updating for role", currentUser.role);
    if (currentUser.role === "customer") {
      if (heroSection) {
        heroSection.style.display = window.location.pathname === "/index.html" ? "flex" : "none";
      }
      navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link hover-light" href="/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="/customer/catalog.html">Catalog</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="/customer/cart.html">Cart</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="/customer/profile.html">Profile</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="#" onclick="logout()">Logout</a></li>
      `;
    } else if (currentUser.role === "seller") {
      navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link hover-light" href="/seller/dashboard.html">Dashboard</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="/seller/products.html">Products</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="/orders.html">Orders</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="#" onclick="logout()">Logout</a></li>
      `;
    } else if (currentUser.role === "admin") {
      navLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link hover-light" href="/admin/dashboard.html">Dashboard</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="/admin/products.html">Products</a></li>
        <li class="nav-item"><a class="nav-link hover-light" href="#" onclick="logout()">Logout</a></li>
      `;
    }
  } else {
    if (heroSection) {
      heroSection.style.display = window.location.pathname === "/index.html" ? "flex" : "none";
    }
    navLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link hover-light" href="/index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link hover-light" href="/customer/catalog.html">Catalog</a></li>
      <li class="nav-item">
        <a class="nav-link hover-light loginsignup" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
      </li>
    `;
  }
}

export function logout() {
  StorageManager.remove("currentUser");
  updateNavbar();
  window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");
  window.logout = logout;
  updateNavbar();
  restrictAccess();
});







// categories in home page 

let categories = CategoryManager.getAllCategories();
let categoriesActiveSlide = document.getElementById("activeSlide");
let categoriesNextSlide = document.getElementById("nextSlide");

for (let i = 0; i < 4; i++) {

  categoriesActiveSlide.innerHTML +=
    `<div class="card  cardItem p-0  position-relative  ">
          <img src="${categories[i].image}" class="rounded w-100 " alt="...">
    
          <div class="cardCaption position-absolute text-center">
            <h5 class="imgContainer text-light">${categories[i].name}</h5>
            <div class="cardDetails text-light">
              <p class="text-light ">0 product</p>
              <button class=" btn p-3 btn-light ">View</button>
            </div>
          </div>
        </div>`; 
};


for (let i = 4; i < 8; i++) {

  categoriesNextSlide.innerHTML += ` <div class="card  cardItem  position-relative ">
          <img src="${categories[i].image}" class="rounded" alt="...">
    
          <div class="cardCaption position-absolute text-center">
            <h5 class="imgContainer text-light">${categories[i].name}</h5>
            <div class="cardDetails text-light ">
              <p class="text-light ">0 product</p>
              <button class=" btn p-3 btn-light ">View</button>
            </div>
          </div>
        </div>`;
  
};

