import { OrderManager } from "./orderManager.js"; // Fetching orders
import { StorageManager } from "./storageManager.js"; // Retrieving the logged-in customer

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = StorageManager.load("currentUser");  
  if (!currentUser) {
    console.error("No logged-in user found.");
    return;
  }

  const orders = OrderManager.getOrdersByCustomer(currentUser.id);
  const ordersContainer = document.querySelector(".order-section");

  if (!orders.length) {
    ordersContainer.innerHTML = "<p class='text-muted'>No orders found.</p>";
    return;
  }

  // Populate the "My Orders" section dynamically
  ordersContainer.innerHTML = orders.map(order => `
    <div class="card border-0 shadow-sm rounded-3 overflow-hidden mb-3">
      <div class="card-body p-4">
        <div class="row g-0 align-items-center">
          <div class="col-md-6 ps-4">
            <h5 class="mb-1 fw-semibold">Order #${order.id}</h5>
            <p class="text-muted small mb-2">Ordered on: ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p class="text-muted small mb-2">Status: 
              <span class="${order.status === 'shipped' ? 'text-success' : 'text-warning'}">${order.status}</span>
            </p>
          </div>
          <div class="col-md-4 text-end">
            <h4 class="fw-bold">$${order.total.toFixed(2)}</h4>
          </div>
        </div>
        <div class="text-end mt-3">
          <a href="#" class="btn btn-link p-0 text-decoration-none view-order" data-id="${order.id}">
            View Details <i class="fas fa-arrow-right ms-1"></i>
          </a>
        </div>
      </div>
    </div>
  `).join("");

  // Add event listeners to "View Details" buttons
  document.querySelectorAll(".view-order").forEach(button => {
    button.addEventListener("click", () => {
      const orderId = button.getAttribute("data-id");
      window.location.href = `orderDetails.html?orderId=${orderId}`;
    });
  });
});
