import { StorageManager } from "./storageManager.js";
import { OrderManager } from "./orderManager.js";
import { showToast } from "./toast.js";
import { UserManager } from "./userManager.js";

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the currently logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Please log in to view your orders.", "error");
    window.location.href = "login.html";
    return;
  }

  // Get all orders and filter those that belong to the current user.
  // Adjust the comparison if your identifier is email or if you use a different property.
  const allOrders = OrderManager.getAllOrders() || [];
  const userOrders = allOrders.filter(
    (order) =>
      order.customerId === currentUser.id ||
      order.customerId === currentUser.email
  );

  // Get the orders section container in the profile (it should exist in your HTML)
  const ordersSection = document.querySelector(".order-section");
  if (!ordersSection) {
    console.error("Orders section container not found in the DOM.");
    return;
  }
  // Remove the d-none class so that the orders section is visible
  ordersSection.classList.remove("d-none");

  // Update the orders count in the header (expects an element with id 'orders-count')
  const ordersCountEl = document.getElementById("orders-count");
  if (ordersCountEl) {
    ordersCountEl.innerText = `${userOrders.length} ${
      userOrders.length === 1 ? "order" : "orders"
    }`;
  }

  // Get the container where the order cards will be injected (an element with id 'order-items')
  const orderItemsContainer = document.getElementById("order-items");
  if (!orderItemsContainer) {
    console.error("Order items container (id='order-items') not found.");
    return;
  }
  // Clear any existing content
  orderItemsContainer.innerHTML = "";

  // Load the products data once to optimize lookup
  const products = StorageManager.load("products") || [];

  // If the user has no orders, inform them
  if (userOrders.length === 0) {
    orderItemsContainer.innerHTML = "<p>You have no orders yet.</p>";
    return;
  }

  // Loop through each order and build its order card
  userOrders.forEach((order) => {
    // Get a comma-separated list of product names in this order
    const productNames = order.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? product.name : "Unknown Product";
      })
      .join(", ");

    // Calculate the total price for the order
    const orderTotal = order.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    // Format the order date. Use order.orderDate or fallback on order.timestamp.
    const orderDate = order.orderDate || order.timestamp || "Unknown date";
    // Use a default status if one isn’t provided
    const orderStatus = order.status || "Processed";

    // Use the first product image as a thumbnail; if unavailable, use a default image.
    const firstProduct = products.find((p) => p.id === order.items[0].productId);
    const orderImageSrc =
      firstProduct && firstProduct.images && firstProduct.images[0]
        ? firstProduct.images[0]
        : "../assets/images/default-order.jpg";

    // Build the HTML structure for the order card (following your static design)
    const orderCardHTML = `
      <div class="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
        <div class="card-body p-4">
          <div class="row g-0 align-items-center">
            <!-- Order Image -->
            <div class="col-md-2">
              <img src="${orderImageSrc}" alt="Order Image" class="img-fluid rounded-3 order-img" />
            </div>
            <!-- Order Details -->
            <div class="col-md-6 ps-4">
              <div>
                <h5 class="mb-1 fw-semibold">Order #${order.id}</h5>
                <p class="text-muted small mb-2">Products: ${productNames}</p>
                <p class="text-muted small mb-2">Ordered on: ${orderDate}</p>
              </div>
            </div>
            <!-- Price and Status -->
            <div class="col-md-4 text-end">
              <h4 class="fw-bold">$${orderTotal.toFixed(2)}</h4>
              <span class="text-success small fw-semibold">
                <i class="fas fa-check-circle me-1"></i> ${orderStatus}
              </span>
            </div>
          </div>
          <!-- View More Button -->
          <div class="text-end mt-3">
            <a href="orderDetails.html?orderId=${order.id}" class="btn btn-link p-0 text-decoration-none">
              View More <i class="fas fa-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    // Append the constructed order card to the container
    orderItemsContainer.insertAdjacentHTML("beforeend", orderCardHTML);
  });
});
