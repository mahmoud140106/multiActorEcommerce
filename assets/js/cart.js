// Import the CartManager and ProductManager modules
import { CartManager } from './cartManager.js';
import { ProductManager } from './productManager.js';

// Render the cart items
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

  console.log(cart); // Debugging log to inspect cart items
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="p-4 text-center">Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;

      // Check stock
      const stockInfo = ProductManager.checkStockAvailability(item.id);
      const isOutOfStock = (stockInfo.stock - quantity) <= 0;

      const cartItemHTML = `
        <div class="row g-0 align-items-center p-4 cart-item">
          <div class="col-md-2 productDetailsItem" product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="img-fluid rounded-3" />
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
                <button class="btn btn-outline-secondary border-end-0 rounded-start decrease-quantity"
                        data-index="${index}" ${quantity <= 0 ? 'disabled' : ''}>-</button>
                <input type="text" class="form-control text-center border-left-0 border-right-0"
                       value="${quantity}" style="width: 40px;" readonly />
                <button class="btn btn-outline-secondary border-start-0 rounded-end increase-quantity"
                        data-index="${index}" ${isOutOfStock ? 'disabled' : ''}>+</button>
              </div>
              <span class="ms-3 fw-semibold">$${price.toFixed(2)}</span>
            </div>
          </div>
          <div class="col-md-4 text-end">
            <h4 class="fw-bold">$${(price * quantity).toFixed(2)}</h4>
            <span class="${isOutOfStock ? 'text-danger' : 'text-success'} small fw-semibold">
              <i class="fas fa-${isOutOfStock ? 'times' : 'check'}-circle me-1"></i>
              ${isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
          </div>
        </div>
        ${index < cart.length - 1 ? '<div class="divider"></div>' : ''}
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });
  }

  // Update order summary
  const summary = CartManager.calculateOrderSummary();
  if (cartItemCount) {
    cartItemCount.textContent = `${summary.totalItems} item${summary.totalItems !== 1 ? 's' : ''}`;
  }
  subtotalLabel.textContent = `Subtotal (${summary.totalItems} item${summary.totalItems !== 1 ? 's' : ''})`;
  subtotalElement.textContent = `$${summary.subtotal.toFixed(2)}`;
  taxElement.textContent = `$${summary.tax.toFixed(2)}`;
  shippingElement.textContent = `$${summary.shipping.toFixed(2)}`;

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

  addCartEventListeners();
  addProductDetailsNavigation();
}

function addCartEventListeners() {
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      CartManager.removeFromCart(index);
      renderCart();
    });
  });

  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      CartManager.updateQuantity(index, 1);
      renderCart();
    });
  });

  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      CartManager.updateQuantity(index, -1);
      renderCart();
    });
  });
}

function addProductDetailsNavigation() {
  document.querySelectorAll('.productDetailsItem').forEach(item => {
    item.addEventListener('click', function () {
      let itemId = item.getAttribute('product-id');
      window.location.href = `productDetails.html?id=${itemId}`;
    });
  });
}

function renderWishlistPeek() {
  const wishlist = CartManager.getWishlist();
  const wishlistItemsContainer = document.getElementById('wishlist-items');

  wishlistItemsContainer.innerHTML = '';

  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = '<p class="p-4 text-center">Your wishlist is empty.</p>';
    return;
  }

  const randomItems = wishlist.sort(() => 0.5 - Math.random()).slice(0, 3);

  randomItems.forEach(item => {
    const stockInfo = ProductManager.checkStockAvailability(item.id);
    const isOutOfStock = stockInfo.stock <= 0;

    const itemHTML = `
      <div class="row g-0 align-items-center p-3 cart-item">
        <div class="col-md-2 productDetailsItem" product-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="img-fluid rounded-3" />
        </div>
        <div class="col-md-6 ps-4">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="mb-1 fw-semibold">${item.name}</h5>
              <p class="text-muted small mb-2">SKU: ${item.sku}</p>
            </div>
          </div>
          <div class="d-flex mt-1">
            <span class="fw-semibold">$${item.price.toFixed(2)}</span>
            <span class="${isOutOfStock ? 'text-danger' : 'text-success'} ms-3 small fw-semibold">
              <i class="fas fa-${isOutOfStock ? 'times' : 'check'}-circle me-1"></i>
              ${isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
          </div>
        </div>
        <div class="col-md-4 text-end">
          <div class="d-flex flex-column flex-sm-row justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-danger remove-wishlist-item" data-id="${item.id}">
              <i class="fas fa-trash-alt me-1"></i> Remove
            </button>
            <button class="btn btn-sm btn-dark add-to-cart" data-id="${item.id}" ${isOutOfStock ? 'disabled' : ''}>
              <i class="fas fa-shopping-cart me-1"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    wishlistItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  document.querySelectorAll('.remove-wishlist-item').forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      CartManager.removeFromWishlist(productId);
      renderWishlistPeek();
    });
  });

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      CartManager.addToCartFromWishlist(productId);
      renderWishlistPeek();
      renderCart();
    });
  });

  addProductDetailsNavigation();
}

// Setup on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  renderWishlistPeek();

  document.getElementById('clear-cart')?.addEventListener('click', () => {
    CartManager.clearCart();
    renderCart();
  });

  document.getElementById('apply-promo')?.addEventListener('click', () => {
    const promoInput = document.getElementById('promo-code').value.trim();
    CartManager.applyPromoCode(promoInput);
    renderCart();
  });

  document.getElementById('checkout-button')?.addEventListener('click', () => {
    const cart = CartManager.getCart();
    if (cart.length === 0) {
      CartManager.showToast('Your cart is empty. Please add items to your cart before checking out.');
    } else {
      window.location.href = './checkout.html';
    }
  });
});
