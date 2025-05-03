import { UserManager } from "./userManager.js";
import { StorageManager } from "./storageManager.js";
import { CartManager } from "./cartManager.js";

(function initializeDefaultAdmin() {
  UserManager.initializeDefaultAdmin();
})();

function restrictAccess() {
  const currentUser = StorageManager.load("currentUser");
  const currentPath = window.location.pathname;
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
      "/seller/updates.html",
    ],

    admin: [
      "/index.html",
      "/admin/dashboard.html",
      "/admin/products.html",
      "/admin/profile.html", 
      "/admin/categories.html",  
    "/admin/messages.html"],
    
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
  const currentPath = window.location.pathname;

  const user = CartManager.getCurrentUser();
  let cartCount, wishlistCount;
  if (user) {
    cartCount = CartManager.getCart().reduce((total, item) => total + (item.quantity || 0), 0); // Calculate total quantity for the current user
    wishlistCount = CartManager.getWishlist().length; // Get the number of items in the current user's wishlist
  } else {
    cartCount = '';
    wishlistCount = '';
  }

  if (!navLinks || !navbar) return;

  if (currentUser && (currentUser.role === "admin" || currentUser.role === "seller")) {

    navbar.classList.add("d-none");
    return;
  }

  navbar.classList.remove("d-none");
  navLinks.innerHTML = "";

  if (!document.getElementById('nav-hover-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'nav-hover-styles';
    styleElement.textContent = `
      .nav-item .nav-text { display: none; transition: all 0.3s ease; margin-left: 5px; }
      .nav-item:hover .nav-text { display: inline; }
      .nav-item .badge { margin-left: 5px; }
      @media (max-width: 767px) { .nav-item .nav-text { display: inline; } }
    `;
    document.head.appendChild(styleElement);
  }

  const profileLink = `
    <li class="nav-item ${currentPath.includes('/profile.html') ? 'active' : ''}">
      <a class="nav-link hover-light" href="/${currentUser?.role}/profile.html" title="Profile">
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

  if (currentUser?.role === "customer") {
    if (heroSection) {
      heroSection.style.display = window.location.pathname === "/index.html" ? "flex" : "none";
    }
    navLinks.innerHTML = `
      <li class="nav-item ${currentPath === "/index.html" ? 'active' : ''}"><a class="nav-link hover-light" href="/index.html" title="Home"><i class="bi bi-house fs-5"></i><span class="nav-text">Home</span></a></li>
      <li class="nav-item ${currentPath.includes('/categories.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/customer/categories.html" title="Categories"><i class="bi bi-list-ul fs-5"></i><span class="nav-text">Categories</span></a></li>
      <li class="nav-item ${currentPath.includes('/product.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/customer/product.html" title="Products"><i class="bi bi-box-seam fs-5"></i><span class="nav-text">Products</span></a></li>
      <li class="nav-item ${currentPath.includes('/wishlist.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/customer/wishlist.html" title="Wishlist"><i class="bi bi-heart fs-5"></i><span class="nav-text">Wishlist</span><span class="badge badge-notification rounded-pill bg-danger">${wishlistCount || ''}</span></a></li>
      <li class="nav-item ${currentPath.includes('/cart.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/customer/cart.html" title="Cart"><i class="bi bi-cart fs-5"></i><span class="nav-text">Cart</span><span class="badge badge-notification rounded-pill bg-danger">${cartCount || ''}</span></a></li>
      ${profileLink}
      ${logoutLink}
    `;
  } else if (currentUser?.role === "seller") {
    navLinks.innerHTML = `
      <li class="nav-item ${currentPath === "/index.html" ? 'active' : ''}"><a class="nav-link hover-light" href="/index.html" title="Home"><i class="bi bi-house fs-5"></i><span class="nav-text">Home</span></a></li>
      <li class="nav-item ${currentPath.includes('/dashboard.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/seller/dashboard.html" title="Dashboard"><i class="bi bi-speedometer2 fs-5"></i><span class="nav-text">Dashboard</span></a></li>
      <li class="nav-item ${currentPath.includes('/products.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/seller/products.html" title="Products"><i class="bi bi-box-seam fs-5"></i><span class="nav-text">Products</span></a></li>
      <li class="nav-item ${currentPath.includes('/orders.html') && !currentPath.includes('/orderDetails.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/seller/orders.html" title="Orders"><i class="bi bi-list-check fs-5"></i><span class="nav-text">Orders</span></a></li>
      <li class="nav-item ${currentPath.includes('/orderDetails.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/seller/orderDetails.html" title="Order Details"><i class="bi bi-receipt fs-5"></i><span class="nav-text">Details</span></a></li>
      ${profileLink}
      ${logoutLink}
    `;
  } else if (currentUser?.role === "admin") {
    navLinks.innerHTML = `
      <li class="nav-item ${currentPath.includes('/dashboard.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/admin/dashboard.html" title="Dashboard"><i class="bi bi-speedometer2 fs-5"></i><span class="nav-text">Dashboard</span></a></li>
      <li class="nav-item ${currentPath.includes('/products.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/admin/products.html" title="Products"><i class="bi bi-box-seam fs-5"></i><span class="nav-text">Products</span></a></li>
      ${profileLink}
      ${logoutLink}
    `;
  } else {
    if (heroSection) {
      heroSection.style.display = window.location.pathname === "/index.html" ? "flex" : "none";
    }
    navLinks.innerHTML = `
      <li class="nav-item ${currentPath === "/index.html" ? 'active' : ''}"><a class="nav-link hover-light" href="/index.html" title="Home"><i class="bi bi-house fs-5"></i><span class="nav-text">Home</span></a></li>
      <li class="nav-item ${currentPath.includes('/categories.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/customer/categories.html" title="Categories"><i class="bi bi-list-ul fs-5"></i><span class="nav-text">Categories</span></a></li>
      <li class="nav-item ${currentPath.includes('/product.html') ? 'active' : ''}"><a class="nav-link hover-light" href="/customer/product.html" title="Products"><i class="bi bi-box-seam fs-5"></i><span class="nav-text">Products</span></a></li>
      <li class="nav-item"><a class="nav-link hover-light" href="#" data-bs-toggle="modal" data-bs-target="#loginModal" title="Login"><i class="bi bi-box-arrow-in-right fs-5"></i><span class="nav-text">Login</span></a></li>
    `;
  }
  
  // Make sure the nav text is visible for active items
  const activeItems = document.querySelectorAll('.nav-item.active .nav-text');
  activeItems.forEach(item => {
    item.style.display = 'inline';
  });
}

export function logout() {
  StorageManager.remove("currentUser");
  updateNavbar();
  window.location.href = "/index.html";
}

function loadNavbar() {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) return;

  fetch("navBar.html")
    .then((res) => res.text())
    .then((html) => {
      navbarContainer.innerHTML = html;
      window.logout = logout;
      updateNavbar();
      restrictAccess();
    })
    .catch((err) => console.error("Failed to load navbar:", err));
}












function bindSearchGoEvent() {
  const searchGoButton = document.getElementById("searchGo");
  if (searchGoButton) {
    searchGoButton.addEventListener("click", () => {
      // console.log("searchGo clicked"); // Debugging
      const searchInputData = document.getElementById("searchInputModal")?.value || document.getElementById("searchInput")?.value;
      if (searchInputData) {
        // console.log("Search input data:", searchInputData); // Debugging
        // Update URL and redirect to product page
        window.location.href = `/customer/product.html?products=${encodeURIComponent(searchInputData.toLowerCase())}`;
        // Hide modal
        const modalElement = document.getElementById("SearchHomeModal");
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modal.hide();
        } else {
          // console.error("Modal element not found"); // Debugging
        }
      } else {
        // console.log("No search input data"); // Debugging
      }
    });
  } else {
    console.error("searchGo button not found"); // Debugging
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindSearchGoEvent();
  loadNavbar();

  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector(".sidebar-toggle");

  if (sidebar && toggleButton) {
    toggleButton.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 769 && !sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
        sidebar.classList.remove("active");
      }
    });
  }
});
