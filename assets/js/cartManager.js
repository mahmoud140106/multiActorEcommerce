import { ProductManager } from "./productManager.js";

export const CartManager = {
  getCurrentUser: function () {
    return JSON.parse(localStorage.getItem("currentUser"));
  },

  // Cart Operations
  getCart: function () {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return [];
    }
    return JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
  },

  addToCart: function (product, quantity = 1) {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      this.openLoginModal(); // Open login modal
      return null;
    }
    let cart = this.getCart();

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        (item.sku === product.sku || item.sku === `SKU-${product.id}`) &&
        item.price === (product.discountedPrice || product.price)
    );

    const currentQuantity = existingItemIndex !== -1 ? cart[existingItemIndex].quantity : 0;
    const desiredQuantity = currentQuantity + quantity;
    const stockCheck = ProductManager.checkStockAvailability(product.id, desiredQuantity);

    if (!stockCheck.available) {
      this.showToast(stockCheck.message || "Product stock limit reached!");
      return null;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`,
      price: product.discountedPrice || product.price,
      image: product.images ? product.images[0] : product.image,
      quantity: quantity,
    };

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
      this.showToast(`${cartItem.name} quantity updated in cart!`);
    } else {
      cart.push(cartItem);
      this.showToast(`${cartItem.name} added to cart!`);
    }

    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    return cartItem;
  },

  removeFromCart: function (index) {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return null;
    }
    let cart = this.getCart();
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    this.showToast("Item removed from cart.");
    return removedItem;
  },

  updateQuantity: function (index, change) {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return [];
    }
    let cart = this.getCart();
    const product = cart[index];
    const newQuantity = product.quantity + change;

    if (newQuantity <= 0) {
      this.removeFromCart(index);
      return cart;
    }

    const stockCheck = ProductManager.checkStockAvailability(product.id, newQuantity);
    if (!stockCheck.available) {
      this.showToast(stockCheck.message || "Not enough stock available!");
      return cart;
    }

    cart[index].quantity = newQuantity;
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    return cart;
  },

  clearCart: function () {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return;
    }
    localStorage.removeItem(`cart_${user.id}`);
    localStorage.removeItem(`promoCode_${user.id}`);
    this.showToast("Cart cleared.");
  },

  applyPromoCode: function (code) {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return false;
    }
    const validPromoCode = "OFF10";
    if (code === validPromoCode) {
      localStorage.setItem(`promoCode_${user.id}`, code);
      this.showToast("Promo code applied! You saved $10.00.");
      return true;
    } else {
      localStorage.removeItem(`promoCode_${user.id}`);
      this.showToast("Invalid promo code!");
      return false;
    }
  },

  // Wishlist Operations
  getWishlist: function () {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return [];
    }
    return JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
  },

  addToWishlist: function (product, event) {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      this.openLoginModal(); // Open login modal
      return null;
    }
    let wishlist = this.getWishlist();
    const wishlistItem = {
      id: product.id,
      name: product.name,
      sku: product.sku || `SKU-${product.id}`,
      price: product.discountedPrice || product.price,
      image: product.images ? product.images[0] : product.image,
      quantity: 1,
    };

    const existingItemIndex = wishlist.findIndex(
      (item) => item.id === wishlistItem.id && item.sku === wishlistItem.sku && item.price === wishlistItem.price
    );

    const wishlistButton = event.currentTarget;

    if (existingItemIndex !== -1) {
      wishlist.splice(existingItemIndex, 1);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
      this.showToast(`${wishlistItem.name} removed from wishlist!`);
      wishlistButton.innerHTML = '<i class="far fa-heart"></i>';
      wishlistButton.classList.remove("btn-clicked");
      wishlistButton.classList.add("btn-light");
    } else {
      wishlist.push(wishlistItem);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
      this.showToast(`${wishlistItem.name} added to wishlist!`);
      wishlistButton.innerHTML = '<i class="fas fa-heart"></i>';
      wishlistButton.classList.remove("btn-light");
      wishlistButton.classList.add("btn-clicked");
    }

    return wishlist;
  },

  removeFromWishlist: function (productId) {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return null;
    }
    let wishlist = this.getWishlist();
    const removedItem = wishlist.find((item) => item.id == productId);
    wishlist = wishlist.filter((item) => item.id != productId);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    this.showToast("Item removed from wishlist");
    return removedItem;
  },

  addToCartFromWishlist: function (productId) {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return null;
    }
    const wishlist = this.getWishlist();
    const item = wishlist.find((item) => item.id == productId);
    if (!item) return null;

    let cart = this.getCart();
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id == item.id);
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

    const updatedWishlist = wishlist.filter((wishlistItem) => wishlistItem.id != productId);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));

    this.showToast(`${item.name} added to cart`);
    return item;
  },

  clearWishlist: function () {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return false;
    }
    localStorage.removeItem(`wishlist_${user.id}`);
    this.showToast("Wishlist cleared");
    return true;
  },

  addAllToCart: function () {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return 0;
    }
    const wishlist = this.getWishlist();
    if (wishlist.length === 0) {
      this.showToast("Your wishlist is empty");
      return 0;
    }

    let cart = this.getCart();
    let addedCount = 0;

    wishlist.forEach((item) => {
      const existingItemIndex = cart.findIndex((cartItem) => cartItem.id == item.id);
      const currentQuantity = existingItemIndex !== -1 ? cart[existingItemIndex].quantity : 0;
      const desiredQuantity = currentQuantity + 1;

      const stockCheck = ProductManager.checkStockAvailability(item.id, desiredQuantity);
      if (!stockCheck.available) {
        this.showToast(`${item.name}: ${stockCheck.message || "Not enough stock available."}`);
        return;
      }

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
      addedCount++;
    });

    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));

    // Clear wishlist without showing toast
    localStorage.removeItem(`wishlist_${user.id}`);

    this.showToast(`Added ${addedCount} items to cart`);
    return addedCount;
  },

  isProductInWishlist: function (productId, wishlistButton) {
    const user = this.getCurrentUser();
    if (!user) {
      return;
    }
    const wishlist = this.getWishlist();
    const existingItem = wishlist.find((item) => item.id === productId);

    if (existingItem) {
      wishlistButton.innerHTML = '<i class="fas fa-heart"></i>';
      wishlistButton.classList.remove("btn-light");
      wishlistButton.classList.add("btn-clicked");
    } else {
      wishlistButton.innerHTML = '<i class="far fa-heart"></i>';
      wishlistButton.classList.remove("btn-clicked");
      wishlistButton.classList.add("btn-light");
    }
  },

  showToast: function (message) {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      console.error("Toast container not found");
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
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  },

  calculateOrderSummary: function () {
    const user = this.getCurrentUser();
    if (!user) {
      this.showToast("Please log in first!");
      return null;
    }
    const cart = this.getCart();
    const promoCode = localStorage.getItem(`promoCode_${user.id}`);

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach((item) => {
      totalItems += item.quantity;
      subtotal += item.price * item.quantity;
    });

    const shipping = 20;
    // const taxRate = 0.06;
    // // const shipping = subtotal * shippRate;
    // const tax = subtotal * taxRate;
    let discount = promoCode === "OFF10" ? 10.0 : 0;

    const total = subtotal + shipping - discount;

    return {
      totalItems,
      subtotal,
      shipping,
      discount,
      total,
      promoCode,
    };
  },

  // New method to open login modal
  openLoginModal: function () {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) {
      const bootstrapModal = new bootstrap.Modal(loginModal);
      bootstrapModal.show();
    } else {
      console.error("Login modal not found");
    }
  },
};
