function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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
  
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let subtotal = 0;
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="p-4 text-center">Your cart is empty.</p>';
    } else {
      cart.forEach((item, index) => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
  
        const cartItemHTML = `
          <div class="row g-0 align-items-center p-4 cart-item">
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
  
    // Update order summary
    cartItemCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    subtotalLabel.textContent = `Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})`;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    
    const shippRate = 0.10; // Flat rate shipping
    const taxRate = 0.06; // 6% tax
    const shipping = subtotal * shippRate;
    const tax = subtotal * taxRate;
    let total = subtotal + shipping + tax;
  
    taxElement.textContent = `$${tax.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
  
    // Handle promo code (simple example: "OFF10" gives $10 off)
    const promoCode = localStorage.getItem('promoCode');
    let discount = 0;
    if (promoCode === 'OFF10') {
      discount = 10.00;
      promoAlert.classList.remove('d-none');
      promoSavings.textContent = `$${discount.toFixed(2)}`;
      originalTotalElement.textContent = `$${total.toFixed(2)}`;
      originalTotalElement.classList.remove('d-none');
    } else {
      promoAlert.classList.add('d-none');
      originalTotalElement.classList.add('d-none');
    }
  
    total -= discount;
    finalTotalElement.textContent = `$${total.toFixed(2)}`;
  
    // Add event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        removeFromCart(index);
      });
    });
  
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        updateQuantity(index, 1);
      });
    });
  
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        updateQuantity(index, -1);
      });
    });
  }
  
  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showToast('Item removed from cart.');
  }
  
  function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
  
  function clearCart() {
    localStorage.removeItem('cart');
    localStorage.removeItem('promoCode');
    renderCart();
    showToast('Cart cleared.');
  }
  
  function applyPromoCode() {
    const promoInput = document.getElementById('promo-code').value.trim();
    if (promoInput === 'OFF10') {
      localStorage.setItem('promoCode', 'OFF10');
      showToast('Promo code applied!');
    } else {
      localStorage.removeItem('promoCode');
      showToast('Invalid promo code.');
    }
    renderCart();
  }
  
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">OmniShop</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('apply-promo').addEventListener('click', applyPromoCode);
  });