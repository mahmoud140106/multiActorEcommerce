import { StorageManager } from "./storageManager.js";
import { ProductManager } from "./productManager.js";

export class CartItem {
  constructor(productId, quantity, size, color) {
    this.productId = productId;
    this.quantity = quantity;
    this.size = size;
    this.color = color;
  }

  getProduct() {
    return ProductManager.getProduct(this.productId);
  }
}

export class Cart {
  static addItem(productId, quantity, size, color) {
    const product = ProductManager.getProduct(productId);
    if (!product) throw new Error("Product not found.");
    if (product.stock < quantity) throw new Error("Insufficient stock.");

    let cart = StorageManager.load("cart") || [];
    const existingItem = cart.find(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem = new CartItem(productId, quantity, size, color);
      cart.push(cartItem);
    }

    StorageManager.save("cart", cart);
  }

  static removeItem(productId, size, color) {
    let cart = StorageManager.load("cart") || [];
    cart = cart.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.size === size &&
          item.color === color
        )
    );
    StorageManager.save("cart", cart);
  }

  static getCart() {
    return StorageManager.load("cart") || [];
  }

  static clearCart() {
    StorageManager.save("cart", []);
  }

  static updateQuantity(productId, size, color, quantity) {
    let cart = StorageManager.load("cart") || [];
    const item = cart.find(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
    if (!item) return;

    const product = ProductManager.getProduct(productId);
    if (product.stock < quantity) throw new Error("Insufficient stock.");

    item.quantity = quantity;
    StorageManager.save("cart", cart);
  }
}
