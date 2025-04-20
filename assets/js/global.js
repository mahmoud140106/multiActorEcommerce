import { UserManager } from './userManager.js';
import { StorageManager } from './storageManager.js';

(function initializeDefaultAdmin() {
  UserManager.initializeDefaultAdmin();
})();

export function updateNavbar() {
  const currentUser = StorageManager.load("currentUser");
  const navLinks = document.querySelector(".navbar-nav");

  if (currentUser) {
    if (currentUser.role === "customer") {
      navLinks.innerHTML = `
              <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="customer/catalog.html">Catalog</a></li>
              <li class="nav-item"><a class="nav-link" href="customer/cart.html">Cart</a></li>
              <li class="nav-item"><a class="nav-link" href="customer/profile.html">Profile</a></li>
              <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
          `;
    } else if (currentUser.role === "seller") {
      navLinks.innerHTML = `
              <li class="nav-item"><a class="nav-link" href="/seller/dashboard.html">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link" href="/admin/products.html">Products</a></li>
              <li class="nav-item"><a class="nav-link" href="orders.html">Orders</a></li>
              <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
          `;
    } else if (currentUser.role === "admin") {
      navLinks.innerHTML = `
              <li class="nav-item"><a class="nav-link" href="/admin/dashboard.html">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link" href="/admin/products.html">Products</a></li>
              <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
          `;
    }
  } else {
    navLinks.innerHTML = `
          <li class="nav-item"><a class="nav-link" href="/index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="/customer/catalog.html">Catalog</a></li>
          <li class="nav-item"><a class="nav-link" href="/login.html">Login</a></li>
      `;
  }
}

export function logout() {
  StorageManager.remove("currentUser");
  window.location.href = "/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  window.logout = logout;
  updateNavbar();
});