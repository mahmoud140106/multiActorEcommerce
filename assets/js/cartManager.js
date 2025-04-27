// cartManager.js
export const CartManager = {
  // Cart Operations
  getCart: function() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },
  
  // Function to add product to cart
  addToCart: function(product) {
    let cart = this.getCart();
    
    // Format the product data to match what cart.js expects
    const cartItem = {
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`, // Fallback if no SKU
      price: product.discountedPrice || product.price,
      image: product.images ? product.images[0] : product.image, // Handle both formats
      quantity: 1
    };
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => 
      item.id === cartItem.id && item.sku === cartItem.sku && item.price === cartItem.price
    );
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.showToast(`${cartItem.name} added to cart!`);
    return cartItem;
  },
  
  // Function to remove item from cart
  removeFromCart: function(index) {
    let cart = this.getCart();
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.showToast(`Item removed from cart.`);
    return removedItem;
  },
  
  // Function to update quantity of cart item
  updateQuantity: function(index, change) {
    let cart = this.getCart();
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
      this.removeFromCart(index);
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
  },
  
  // Function to clear cart
  clearCart: function() {
    localStorage.removeItem('cart');
    localStorage.removeItem('promoCode');
    this.showToast('Cart cleared.');
  },
  
  // Function to apply promo code
  applyPromoCode: function(code) {
    const validCodes = {
      'OFF10': { discount: 10, type: 'fixed' }
      // Add more promo codes as needed
    };
    
    if (validCodes[code]) {
      localStorage.setItem('promoCode', code);
      this.showToast('Promo code applied!');
      return validCodes[code];
    } else {
      localStorage.removeItem('promoCode');
      this.showToast('Invalid promo code.');
      return null;
    }
  },
  
  // Wishlist Operations
  getWishlist: function() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  },
  
  // Function to add product to wishlist
  addToWishlist: function(product, event) {
    let wishlist = this.getWishlist();
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`,
      price: product.discountedPrice || product.price,
      image: product.images ? product.images[0] : product.image,
      quantity: 1
    };
    
    // Check if product already exists in wishlist
    const existingItemIndex = wishlist.findIndex(item => 
      item.id === wishlistItem.id && item.sku === wishlistItem.sku && item.price === wishlistItem.price
    );
    
    // Find the specific button that was clicked
    const wishlistButton = event.currentTarget;
    
    if (existingItemIndex !== -1) {
      // Remove from wishlist
      wishlist.splice(existingItemIndex, 1);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.showToast(`${wishlistItem.name} removed from wishlist!`);
      
      // Update button appearance
      wishlistButton.innerHTML = '<i class="far fa-heart"></i>';
      wishlistButton.classList.remove('btn-clicked');
      wishlistButton.classList.add('btn-light');
    } else {
      // Add to wishlist
      wishlist.push(wishlistItem);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.showToast(`${wishlistItem.name} added to wishlist!`);
      
      // Update button appearance
      wishlistButton.innerHTML = '<i class="fas fa-heart"></i>';
      wishlistButton.classList.remove('btn-light');
      wishlistButton.classList.add('btn-clicked');
    }
    
    return wishlist;
  },
  
  // Function to remove item from wishlist
  removeFromWishlist: function(productId) {
    let wishlist = this.getWishlist();
    const removedItem = wishlist.find(item => item.id == productId);
    wishlist = wishlist.filter(item => item.id != productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    this.showToast('Item removed from wishlist');
    return removedItem;
  },
  
  // Function to add item from wishlist to cart
  addToCartFromWishlist: function(productId) {
    const wishlist = this.getWishlist();
    const item = wishlist.find(item => item.id == productId);
    
    if (item) {
      let cart = this.getCart();
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id == item.id);
      
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
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
      this.showToast(`${item.name} added to cart`);
      return item;
    }
    return null;
  },
  
  // Function to clear wishlist
  clearWishlist: function(confirmDialog = true) {
    if (!confirmDialog || confirm('Are you sure you want to clear your entire wishlist?')) {
      localStorage.removeItem('wishlist');
      this.showToast('Wishlist cleared');
      return true;
    }
    return false;
  },
  
  // Function to add all wishlist items to cart
  addAllToCart: function() {
    const wishlist = this.getWishlist();
    
    if (wishlist.length === 0) {
      this.showToast('Your wishlist is empty');
      return 0;
    }

    let cart = this.getCart();
    let addedCount = 0;

    wishlist.forEach(item => {
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id == item.id);
      
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
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
    this.showToast(`Added ${addedCount} items to cart`);
    return addedCount;
  },
  
  // Function to show toast notifications
  showToast: function(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      console.error('Toast container not found');
      return;
    }
    
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
  },
  
  // Calculate order summary
  calculateOrderSummary: function() {
    const cart = this.getCart();
    const promoCode = localStorage.getItem('promoCode');
    
    let totalItems = 0;
    let subtotal = 0;
    
    cart.forEach(item => {
      totalItems += item.quantity;
      subtotal += item.price * item.quantity;
    });
    
    const shippRate = 0.10; // Flat rate shipping
    const taxRate = 0.06; // 6% tax
    const shipping = subtotal * shippRate;
    const tax = subtotal * taxRate;
    
    let discount = 0;
    if (promoCode === 'OFF10') {
      discount = 10.00;
    }
    
    const total = subtotal + shipping + tax - discount;
    
    return {
      totalItems,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      promoCode
    };
  }
};