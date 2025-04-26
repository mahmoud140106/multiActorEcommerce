document.addEventListener('DOMContentLoaded', function() {
  // Initial render
  renderWishlist();
});

function renderWishlist() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlistContainer = document.querySelector('.card-body.p-0');
  const summaryContainer = document.querySelector('.col-lg-3 .card-body');
  
  // Clear existing items
  wishlistContainer.innerHTML = '';
  
  if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `
          <div class="p-4 text-center">
              <i class="far fa-heart text-danger fa-3x mb-3"></i>
              <h5 class="mb-2">Your wishlist is empty</h5>
              <p class="text-muted">Add items to your wishlist to save them for later</p>
              <a href="product.html" class="btn btn-dark mt-3">Continue Shopping</a>
          </div>
      `;
      
      // Update summary
      summaryContainer.innerHTML = `
          <h5 class="card-title fw-semibold mb-4">Wishlist Summary</h5>
          <div class="text-center py-4">
              <i class="far fa-heart text-muted fa-2x"></i>
              <p class="mt-2 mb-0">No items in wishlist</p>
          </div>
      `;
      return;
  }

  let totalValue = 0;
  let inStockCount = 0;
  let lowStockCount = 0;
  
  // Generate wishlist items HTML
  wishlist.forEach((item, index) => {
      const productId = item.id;
      const isLowStock = item.stockStatus === 'low';
      if (item.stockStatus === 'in') inStockCount++;
      if (isLowStock) lowStockCount++;
      
      totalValue += item.price * (item.quantity || 1);
      
      const itemHTML = `
          <div class="row g-0 align-items-center p-4 wishlist-item" data-id="${productId}">
              <div class="col-md-2">
                  <img src="${item.image}" alt="${item.name}" class="img-fluid rounded-3">
              </div>
              <div class="col-md-6 ps-4">
                  <div class="d-flex justify-content-between align-items-start">
                      <div>
                          <h5 class="mb-1 fw-semibold">${item.name}</h5>
                          <p class="text-muted small mb-2">SKU: ${item.sku}</p>
                      </div>
                  </div>
                  ${item.size ? `
                  <div class="d-flex flex-wrap gap-3 mb-2">
                      <div class="d-flex align-items-center">
                          <span class="text-muted me-2">Size:</span>
                          <div class="dropdown">
                              <button class="btn btn-sm btn-outline-secondary dropdown-toggle py-0 px-2" type="button" data-bs-toggle="dropdown">
                                  ${item.size}
                              </button>
                              <ul class="dropdown-menu">
                                  <li><a class="dropdown-item" href="#">39</a></li>
                                  <li><a class="dropdown-item" href="#">40</a></li>
                                  <li><a class="dropdown-item" href="#">41</a></li>
                                  <li><a class="dropdown-item" href="#">42</a></li>
                                  <li><a class="dropdown-item" href="#">43</a></li>
                              </ul>
                          </div>
                      </div>
                  ` : ''}
                  ${item.color ? `
                      <div class="d-flex align-items-center">
                          <span class="text-muted me-2">Color:</span>
                          ${generateColorOptions(item.color)}
                      </div>
                  ` : ''}
                  </div>
                  <div class="d-flex mt-2">
                      <h5 class="fw-semibold">$${item.price.toFixed(2)}</h5>
                      <span class="${isLowStock ? 'text-warning' : 'text-success'} ms-3 small fw-semibold mt-1">
                          <i class="fas ${isLowStock ? 'fa-clock' : 'fa-check-circle'} me-1"></i> 
                          ${isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                  </div>
              </div>
              <div class="col-md-4 text-end">
                  <div class="d-flex flex-column gap-2">
                      <button class="btn btn-dark add-to-cart-btn" data-id="${productId}">
                          <i class="fas fa-shopping-cart me-2"></i> Add to Cart
                      </button>
                      <button class="btn btn-outline-danger remove-item-btn" data-id="${productId}">
                          <i class="fas fa-trash-alt me-2"></i> Remove
                      </button>
                  </div>
              </div>
          </div>
          ${index < wishlist.length - 1 ? '<div class="divider"></div>' : ''}
      `;
      wishlistContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  // Update summary
  summaryContainer.innerHTML = `
      <h5 class="card-title fw-semibold mb-4">Wishlist Summary</h5>
      
      <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Total Items</span>
          <span>${wishlist.length}</span>
      </div>
      <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">In Stock</span>
          <span>${inStockCount}</span>
      </div>
      <div class="d-flex justify-content-between mb-4">
          <span class="text-muted">Low Stock</span>
          <span>${lowStockCount}</span>
      </div>
      
      <hr>
      
      <div class="d-flex justify-content-between mb-3">
          <strong>Total Value</strong>
          <span class="fw-bold fs-5">$${totalValue.toFixed(2)}</span>
      </div>
      
      <button id="add-all-to-cart" class="btn btn-dark rounded-pill w-100 py-3 fw-semibold mb-3">
          <i class="fas fa-shopping-cart me-2"></i>Add All to Cart
      </button>
      
      <div class="alert alert-info py-2 small mb-0" role="alert">
          <i class="fas fa-info-circle me-2"></i> Items in your wishlist will be saved for 30 days
      </div>
  `;

  // Update header count
  document.querySelector('.text-muted').textContent = `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}`;

  // Add event listeners after rendering
  addEventListeners();
}

function generateColorOptions(selectedColor) {
  const colors = ['primary', 'dark', 'secondary', 'danger', 'white'];
  return colors.map(color => {
      const isSelected = color === selectedColor.toLowerCase();
      return `<div class="color-option bg-${color} ${isSelected ? 'selected' : ''}"></div>`;
  }).join('');
}

function addEventListeners() {
  // Remove item buttons
  document.querySelectorAll('.remove-item-btn').forEach(button => {
      button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          removeFromWishlist(productId);
      });
  });

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          addToCartFromWishlist(productId);
      });
  });

  // Clear wishlist button
  const clearWishlistBtn = document.querySelector('.btn-danger.rounded-pill');
  if (clearWishlistBtn) {
      clearWishlistBtn.addEventListener('click', clearWishlist);
  }

  // Add all to cart button
  const addAllToCartBtn = document.getElementById('add-all-to-cart');
  if (addAllToCartBtn) {
      addAllToCartBtn.addEventListener('click', function() {
          addAllToCart();
      });
  }
}

function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist = wishlist.filter(item => item.id != productId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  renderWishlist();
  showToast('Item removed from wishlist');
}

function addToCartFromWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const item = wishlist.find(item => item.id == productId);
  
  if (item) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(cartItem => cartItem.id == item.id);
      
      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          cart.push({
              id: item.id,
              name: item.name,
              sku: item.sku,
              price: item.price,
              image: item.image,
              quantity: 1
          });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      showToast(`${item.name} added to cart`);
  }
}

function clearWishlist() {
  if (confirm('Are you sure you want to clear your entire wishlist?')) {
      localStorage.removeItem('wishlist');
      renderWishlist();
      showToast('Wishlist cleared');
  }
}

function addAllToCart() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  if (wishlist.length === 0) {
      showToast('Your wishlist is empty');
      return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let addedCount = 0;

  wishlist.forEach(item => {
      const existingItem = cart.find(cartItem => cartItem.id == item.id);
      
      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          cart.push({
              id: item.id,
              name: item.name,
              sku: item.sku,
              price: item.price,
              image: item.image,
              quantity: 1
          });
      }
      addedCount++;
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  showToast(`Added ${addedCount} items to cart`);
  
  // Uncomment next 2 lines if you want to clear wishlist after adding to cart
  // localStorage.removeItem('wishlist');
  // renderWishlist();
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