import { UserManager } from "./userManager.js";
import { StorageManager } from "./storageManager.js";

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
      "/customer/wishlist.html",
      "/customer/completedOrder.html",
      "/customer/product.html",
    ],
    seller: [
      "/index.html",
      "/seller/dashboard.html",
      "/seller/products.html",
      "/seller/orders.html",
      "/seller/orderDetails.html",
      "/seller/profile.html",
      "/seller/updates.html",
    ],
    admin: [
      "/index.html",
      "/admin/dashboard.html",
      "/admin/products.html",
      "/admin/profile.html",
      "/admin/messages.html",
    ],
    guest: [
      "/index.html",
      "/customer/catalog.html",
      "/customer/productDetails.html",
      "/customer/categories.html",
      "/customer/product.html",
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
  const currentUser = StorageManager.load("currentUser");
  const navLinks = document.querySelector(".navbar-nav");
  const navbar = document.querySelector(".navbar");
  const heroSection = document.querySelector("#hero-section");

  // Get cart and wishlist counts
  const cart = StorageManager.load("cart") || [];
  const wishlist = StorageManager.load("wishlist") || [];
  const cartCount = cart.length || 0;
  const wishlistCount = wishlist.length || 0;

  if (!navLinks || !navbar) {
    return;
  }

  // Hide navbar for admin/seller (assuming they have their own navigation)
  if (
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "seller")
  ) {
    navbar.classList.add("d-none");
    return;
  }

  navbar.classList.remove("d-none");
  navLinks.innerHTML = "";

  // Add CSS for nav text hover effect
  if (!document.getElementById("nav-hover-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "nav-hover-styles";
    styleElement.textContent = `
      .nav-item .nav-text {
        display: none;
        transition: all 0.3s ease;
        margin-left: 5px;
      }
      
      .nav-item:hover .nav-text {
        display: inline;
      }
      
      .nav-item .badge {
        margin-left: 5px;
      }
      
      @media (max-width: 767px) {
        .nav-item .nav-text {
          display: inline;
        }
      }
    `;
    document.head.appendChild(styleElement);
  }

  if (currentUser && currentUser.role) {
    // Common elements for all logged-in users
    const profileLink = `
      <li class="nav-item">
        <a class="nav-link hover-light" href="/${currentUser.role}/profile.html" title="Profile">
          <i class="bi bi-person fs-5"></i>
          <span class="nav-text">Profile</span>
        </a>
      </li>
    `;

    const logoutLink = `
      <li class="nav-item">
        <a class="nav-link hover-light" href="#" onclick="logout()" title="Logout">
          <i class="bi bi-box-arrow-right fs-5"></i>
          <span class="nav-text">Logout</span>
        </a>
      </li>
    `;

    if (currentUser.role === "customer") {
      if (heroSection) {
        heroSection.style.display =
          window.location.pathname === "/index.html" ? "flex" : "none";
      }

      navLinks.innerHTML = `
        <li class="nav-item">
          <a class="nav-link hover-light" href="/index.html" title="Home">
            <i class="bi bi-house fs-5"></i>
            <span class="nav-text">Home</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/customer/categories.html" title="Categories">
            <i class="bi bi-list-ul fs-5"></i>
            <span class="nav-text">Categories</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/customer/product.html" title="Products">
            <i class="bi bi-box-seam fs-5"></i>
            <span class="nav-text">Products</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/customer/wishlist.html" title="Wishlist">
            <i class="bi bi-heart fs-5"></i>
            <span class="nav-text">Wishlist</span>
            <span class="badge badge-notification rounded-pill bg-danger">${
              wishlistCount > 0 ? wishlistCount : ""
            }</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/customer/cart.html" title="Cart">
            <i class="bi bi-cart fs-5"></i>
            <span class="nav-text">Cart</span>
            <span class="badge badge-notification rounded-pill bg-danger">${
              cartCount > 0 ? cartCount : ""
            }</span>
          </a>
        </li>
        ${profileLink}
        ${logoutLink}
      `;
    } else if (currentUser.role === "seller") {
      navLinks.innerHTML = `
        <li class="nav-item">
          <a class="nav-link hover-light" href="/index.html" title="Home">
            <i class="bi bi-house fs-5"></i>
            <span class="nav-text">Home</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/seller/dashboard.html" title="Dashboard">
            <i class="bi bi-speedometer2 fs-5"></i>
            <span class="nav-text">Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/seller/products.html" title="Products">
            <i class="bi bi-box-seam fs-5"></i>
            <span class="nav-text">Products</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/seller/orders.html" title="Orders">
            <i class="bi bi-list-check fs-5"></i>
            <span class="nav-text">Orders</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/seller/orderDetails.html" title="Order Details">
            <i class="bi bi-receipt fs-5"></i>
            <span class="nav-text">Details</span>
          </a>
        </li>
        ${profileLink}
        ${logoutLink}
      `;
    } else if (currentUser.role === "admin") {
      navLinks.innerHTML = `
        <li class="nav-item">
          <a class="nav-link hover-light" href="/admin/dashboard.html" title="Dashboard">
            <i class="bi bi-speedometer2 fs-5"></i>
            <span class="nav-text">Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link hover-light" href="/admin/products.html" title="Products">
            <i class="bi bi-box-seam fs-5"></i>
            <span class="nav-text">Products</span>
          </a>
        </li>
        ${profileLink}
        ${logoutLink}
      `;
    }
  } else {
    // Guest (not logged in) state
    if (heroSection) {
      heroSection.style.display =
        window.location.pathname === "/index.html" ? "flex" : "none";
    }
    navLinks.innerHTML = `
      <li class="nav-item">
        <a class="nav-link hover-light" href="/index.html" title="Home">
          <i class="bi bi-house fs-5"></i>
          <span class="nav-text">Home</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link hover-light" href="/customer/categories.html" title="Categories">
          <i class="bi bi-list-ul fs-5"></i>
          <span class="nav-text">Categories</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link hover-light" href="/customer/product.html" title="Products">
          <i class="bi bi-box-seam fs-5"></i>
          <span class="nav-text">Products</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link hover-light" href="#" data-bs-toggle="modal" data-bs-target="#loginModal" title="Login">
          <i class="bi bi-box-arrow-in-right fs-5"></i>
          <span class="nav-text">Login</span>
        </a>
      </li>
      <li class="nav-item" id="searchIcon">
        <a class="nav-link hover-light" href="#" data-bs-toggle="modal" data-bs-target="#SearchHomeModal" title="Search">
          <i class="fa-solid fa-magnifying-glass fs-5"></i>
          <span class="nav-text">Search</span>
        </a>
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
  window.logout = logout;
  updateNavbar();
  restrictAccess();

  // Sidebar toggle logic
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector(".sidebar-toggle");
  if (sidebar && toggleButton) {
    toggleButton.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 769 &&
        !sidebar.contains(e.target) &&
        !toggleButton.contains(e.target)
      ) {
        sidebar.classList.remove("active");
      }
    });
  }
});
