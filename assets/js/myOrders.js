import { StorageManager } from "./storageManager.js";
import { OrderManager } from "./orderManager.js";
import { ProductManager } from "./productManager.js";

document.addEventListener("DOMContentLoaded", () => {
  // Get the current user
  const currentUser = StorageManager.load("currentUser");
  if (!currentUser) {
    console.error("No logged-in user found.");
    document.querySelector(".order-section").innerHTML =
      "<p>Please log in to view your orders.</p>";
    return;
  }

  // Get the order section and orders count element
  const orderSection = document.querySelector(".order-section");
  const ordersCountElement = document.getElementById("orders-count");

  // Function to render orders
  function renderOrders() {
    const orders = OrderManager.getOrdersByCustomer(currentUser.id);
    const ordersContainer = orderSection.querySelector(".card")?.parentElement || orderSection;

    // Clear existing order cards
    ordersContainer.innerHTML = "";

    // Update orders count
    ordersCountElement.textContent = `${orders.length} order${orders.length !== 1 ? "s" : ""}`;

    if (orders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    // Generate order cards
    orders.forEach((order) => {
      // Get product names for display
      const productNames = order.items
        .map((item) => {
          const product = ProductManager.getProduct(item.productId);
          return product ? product.name : "Unknown Product";
        })
        .join(", ");

      // Format the order date
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Get the first product's image for display (or a default image)
      const firstItem = order.items[0];
      const product = firstItem ? ProductManager.getProduct(firstItem.productId) : null;
      const imageUrl = product?.images[0] || "../assets/images/shopping16.jpg";

      // Determine status styling
      const statusClass =
        order.status === "shipped" || order.status === "delivered"
          ? "text-success"
          : order.status === "cancelled"
          ? "text-danger"
          : "text-warning";
      const statusIcon =
        order.status === "shipped" || order.status === "delivered"
          ? "fa-check-circle"
          : order.status === "cancelled"
          ? "fa-times-circle"
          : "fa-clock";

      // Create order card HTML
      const orderCardHTML = `
        <div class="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
          <div class="card-body p-4">
            <div class="row g-0 align-items-center">
              <!-- Order Image -->
              <div class="col-md-2">
                <img
                  src="${imageUrl}"
                  alt="Order Image"
                  class="img-fluid rounded-3 order-img"
                />
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
                <h4 class="fw-bold">$${order.total.toFixed(2)}</h4>
                <span class="${statusClass} small fw-semibold">
                  <i class="fas fa-${statusIcon} me-1"></i> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <!-- View More Button -->
            <div class="text-end mt-3">
              <a href="orderDetails.html?orderId=${order.id}" class="btn btn-link p-0 text-decoration-none">
                View Details <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      `;

      // Append the order card to the container
      ordersContainer.insertAdjacentHTML("beforeend", orderCardHTML);
    });
  }

  // Initial render of orders
  renderOrders();

  // Add event listener for the "My Orders" sidebar item to show the order section
  const ordersListItem = document.querySelector(".profile-list li:nth-child(2)");
  ordersListItem.addEventListener("click", () => {
    // Hide other sections and show order section
    document.querySelectorAll(".main").forEach((section) => {
      section.classList.add("d-none");
    });
    orderSection.classList.remove("d-none");

    // Update active state in sidebar
    document.querySelectorAll(".profile-list li").forEach((li) => {
      li.classList.remove("active");
    });
    ordersListItem.classList.add("active");

    // Re-render orders to ensure latest data
    renderOrders();
  });
});