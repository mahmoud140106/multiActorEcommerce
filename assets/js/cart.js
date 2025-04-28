// Import the CartManager module
import { CartManager } from './cartManager.js';

function renderCart() {
  const cart = CartManager.getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const cartItemCount = document.getElementById('cart-item-count');
  const subtotalLabel = document.getElementById('subtotal-label');
  const subtotalElement = document.getElementById('subtotal');
  const taxElement = document.getElementById('tax');
  const shippingElement = document.getElementById('shipping');
  const finalTotalElement = document.getElementById('final-total');
  const originalTotalElement = document.getElementById('original-total');
  const promoAlert = document.getElementById('promo-alert');
  const promoSavings = document.getElementById('promo-savings');
  
  console.log(cart);
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="p-4 text-center">Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      const cartItemHTML = `
        <div class="row g-0 align-items-center p-4 cart-item" product-id="${item.id}">
          <div class="col-md-2">
            <img
              src="${item.image}"
              alt="${item.name}"
              class="img-fluid rounded-3"
            />
          </div>
          <div class="col-md-6 ps-4">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="mb-1 fw-semibold">${item.name}</h5>
                <p class="text-muted small mb-2">SKU: ${item.sku}</p>
              </div>
              <button class="btn btn-sm btn-link text-danger p-0 remove-item" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="d-flex align-items-center">
              <div class="input-group input-group-sm w-auto">
                <button
                  class="btn btn-outline-secondary border-end-0 rounded-start decrease-quantity"
                  data-index="${index}"
                >
                  -
                </button>
                <input
                  type="text"
                  class="form-control text-center border-left-0 border-right-0"
                  value="${item.quantity}"
                  style="width: 40px;"
                  readonly
                />
                <button
                  class="btn btn-outline-secondary border-start-0 rounded-end increase-quantity"
                  data-index="${index}"
                >
                  +
                </button>
              </div>
              <span class="ms-3 fw-semibold">$${item.price.toFixed(2)}</span>
            </div>
          </div>
          <div class="col-md-4 text-end">
            <h4 class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</h4>
            <span class="text-success small fw-semibold"
              ><i class="fas fa-check-circle me-1"></i> In Stock</span
            >
          </div>
        </div>
        ${index < cart.length - 1 ? '<div class="divider"></div>' : ''}
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });
  }
  
  // Use CartManager to calculate order summary
  const summary = CartManager.calculateOrderSummary();
  
  // Update order summary display
  cartItemCount.textContent = `${summary.totalItems} item${summary.totalItems !== 1 ? 's' : ''}`;
  subtotalLabel.textContent = `Subtotal (${summary.totalItems} item${summary.totalItems !== 1 ? 's' : ''})`;
  subtotalElement.textContent = `$${summary.subtotal.toFixed(2)}`;
  taxElement.textContent = `$${summary.tax.toFixed(2)}`;
  shippingElement.textContent = `$${summary.shipping.toFixed(2)}`;
  
  // Handle promo code display
  if (summary.promoCode === 'OFF10') {
    promoAlert.classList.remove('d-none');
    promoSavings.textContent = `$${summary.discount.toFixed(2)}`;
    originalTotalElement.textContent = `$${(summary.total + summary.discount).toFixed(2)}`;
    originalTotalElement.classList.remove('d-none');
  } else {
    promoAlert.classList.add('d-none');
    originalTotalElement.classList.add('d-none');
  }
  
  finalTotalElement.textContent = `$${summary.total.toFixed(2)}`;
  
  // Add event listeners for cart items
  addCartEventListeners();
}

function addCartEventListeners() {
  // Remove item buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      CartManager.removeFromCart(index);
      renderCart();
    });
  });

  // Increase quantity buttons
  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      CartManager.updateQuantity(index, 1);
      renderCart();
    });
  });

  // Decrease quantity buttons
  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      CartManager.updateQuantity(index, -1);
      renderCart();
    });
  });
}

// Handle checkout button
document.getElementById("checkout-button")?.addEventListener('click', () => {
  const cart = CartManager.getCart();
  if (cart.length === 0) {
    CartManager.showToast('Your cart is empty. Please add items to your cart before checking out.');
    return;
  } else {
    window.location.href = './checkout.html'; // Redirect to checkout page
  }
});

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  
  // Add event listeners for cart page buttons
  document.getElementById('clear-cart')?.addEventListener('click', () => {
    CartManager.clearCart();
    renderCart();
  });
  
  document.getElementById('apply-promo')?.addEventListener('click', () => {
    const promoInput = document.getElementById('promo-code').value.trim();
    CartManager.applyPromoCode(promoInput);
    renderCart();
  });

  //link cart items with product Details page

 let cartItems= document.querySelectorAll('.cart-item');
 cartItems.forEach((item)=>{
  item.addEventListener('click',function(){
    let itemId= item.getAttribute('product-id');
    window.location.href=`productDetails.html?id=${itemId}`;
  })
 })
 
});