import { ProductManager } from "./productManager.js";

export const CartManager = {
  // Cart Operations
  getCart: function() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },
  
  // Function to add product to cart
  addToCart: function(product) {
    let cart = this.getCart();
  
    const existingItemIndex = cart.findIndex(item =>
      item.id === product.id &&
      (item.sku === product.sku || item.sku === `SKU-${product.id}`) &&
      (item.price === (product.discountedPrice || product.price))
    );
  
    const currentQuantity = existingItemIndex !== -1 ? cart[existingItemIndex].quantity : 0;
    const desiredQuantity = currentQuantity + 1;
  
    const stockCheck = ProductManager.checkStockAvailability(product.id, desiredQuantity);
  
    if (!stockCheck.available) {
      this.showToast(stockCheck.message || "Product stock limit reached!");
      return null;
    }
  
    // Format the product data to match what cart.js expects
    const cartItem = {
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`,
      price: product.discountedPrice || product.price,
      image: product.images ? product.images[0] : product.image,
      quantity: 1
    };
  
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
      this.showToast(`${cartItem.name} quantity updated in cart!`);
    } else {
      cart.push(cartItem);
      this.showToast(`${cartItem.name} added to cart!`);
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
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
    const product = cart[index];
    const newQuantity = product.quantity + change;
  
    if (newQuantity <= 0) {
      this.removeFromCart(index);
      return cart;
    }
  
    // Check if stock allows this change
    const stockCheck = ProductManager.checkStockAvailability(product.id, newQuantity);
    if (!stockCheck.available) {
      this.showToast(stockCheck.message || "Not enough stock available!");
      return cart;
    }
  
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  
  // Function to clear cart
  clearCart: function() {
    localStorage.removeItem('cart');
    localStorage.removeItem('promoCode');
    this.showToast('Cart cleared.');
  },
  
  // Updated applyPromoCode function for fixed $10 discount
  applyPromoCode: function(code) {
    const validPromoCode = "OFF10";
    if (code === validPromoCode) {
      localStorage.setItem('promoCode', code);
      this.showToast(`Promo code applied! You saved $10.00.`);
      return true;
    } else {
      localStorage.removeItem('promoCode');
      this.showToast('Invalid promo code!');
      return false;
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
  
    if (!item) return null;
  
    let cart = this.getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id == item.id);
    const currentQuantity = existingItemIndex !== -1 ? cart[existingItemIndex].quantity : 0;
    const desiredQuantity = currentQuantity + 1;
  
    const stockCheck = ProductManager.checkStockAvailability(item.id, desiredQuantity);
    if (!stockCheck.available) {
      this.showToast(stockCheck.message || "Not enough stock to add item.");
      return null;
    }
  
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
  
    // Remove from wishlist
    const updatedWishlist = wishlist.filter(wishlistItem => wishlistItem.id != productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    localStorage.setItem('cart', JSON.stringify(cart));
  
    this.showToast(`${item.name} added to cart`);
    return item;
  },
  
  // Function to clear wishlist
  clearWishlist: function() {
    localStorage.removeItem('wishlist');
    this.showToast('Wishlist cleared');
    return true;
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
      const currentQuantity = existingItemIndex !== -1 ? cart[existingItemIndex].quantity : 0;
      const desiredQuantity = currentQuantity + 1;
  
      const stockCheck = ProductManager.checkStockAvailability(item.id, desiredQuantity);
      if (!stockCheck.available) {
        this.showToast(`${item.name}: ${stockCheck.message || "Not enough stock available."}`);
        return; // Skip this item
      }
  
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
        <div class="toast-header d-flex">
          <button type="button" class="btn btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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