import { UserManager } from "./userManager.js";
import { StorageManager } from "./storageManager.js";

(function initializeDefaultAdmin() {
  UserManager.initializeDefaultAdmin();
})();

// protect routes
function restrictAccess() {
  const currentUser = StorageManager.load("currentUser");
  const currentPath = window.location.pathname;

  const allowedPaths = {
    customer: [
      "/index.html",
      "/customer/catalog.html",
      "/customer/cart.html",
      "/customer/profile.html",
    ],
    seller: [
      "/index.html",
      "/seller/dashboard.html",
      "/admin/products.html",
      "/orders.html",
    ],
    admin: ["/index.html", "/admin/dashboard.html", "/admin/products.html"],
    guest: ["/index.html", "/customer/catalog.html"],
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
  const currentUser = StorageManager.load("currentUser");
  const navLinks = document.querySelector(".navbar-nav");
  const heroSection = document.querySelector("#hero-section");

  if (currentUser) {
    if (
      currentUser.role === "customer" &&
      window.location.pathname === "/index.html"
    ) {
      heroSection.style.display = "flex";
      navLinks.innerHTML = `
              <li class="nav-item"><a class="nav-link hover-light" href="index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="customer/catalog.html">Catalog</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="customer/cart.html">Cart</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="customer/profile.html">Profile</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="#" onclick="logout()">Logout</a></li>
          `;
    } else if (currentUser.role === "seller") {
      navLinks.innerHTML = `
              <li class="nav-item"><a class="nav-link hover-light" href="/index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="/seller/dashboard.html">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="/admin/products.html">Products</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="orders.html">Orders</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="#" onclick="logout()">Logout</a></li>
          `;
    } else if (currentUser.role === "admin") {
      navLinks.innerHTML = `
              <li class="nav-item"><a class="nav-link hover-light" href="/index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="/admin/dashboard.html">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="/admin/products.html">Products</a></li>
              <li class="nav-item"><a class="nav-link hover-light" href="#" onclick="logout()">Logout</a></li>
          `;
    }
  } else {
    if (window.location.pathname === "/index.html") {
      heroSection.style.display = "flex";
    }

    navLinks.innerHTML = `
          <li class="nav-item"><a class="nav-link hover-light" href="/index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link hover-light" href="/customer/catalog.html">Catalog</a></li>
           <li class="nav-item" >
                  <a class="nav-link hover-light loginsignup" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
          </li>
      `;
  }
}

export function logout() {
  StorageManager.remove("currentUser");
  window.location.href = "/index.html";
  updateNavbar();
}

document.addEventListener("DOMContentLoaded", () => {
  window.logout = logout;
  updateNavbar();
  restrictAccess();
});
