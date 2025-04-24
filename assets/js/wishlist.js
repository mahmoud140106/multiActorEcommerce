import { StorageManager } from "./storageManager.js";
import { ProductManager } from "./productManager.js";

export class WishlistItem {
  constructor(productId, size, color) {
    this.productId = productId;
    this.size = size;
    this.color = color;
    this.addedAt = new Date();
  }

  getProduct() {
    return ProductManager.getProduct(this.productId);
  }
}

export class Wishlist {
  static addItem(productId, size, color) {
    let wishlist = StorageManager.load("wishlist") || [];
    const exists = wishlist.find(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
    if (exists) return;

    const wishlistItem = new WishlistItem(productId, size, color);
    wishlist.push(wishlistItem);
    StorageManager.save("wishlist", wishlist);
  }

  static removeItem(productId, size, color) {
    let wishlist = StorageManager.load("wishlist") || [];
    wishlist = wishlist.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.size === size &&
          item.color === color
        )
    );
    StorageManager.save("wishlist", wishlist);
  }

  static getWishlist() {
    return StorageManager.load("wishlist") || [];
  }

  static clearWishlist() {
    StorageManager.save("wishlist", []);
  }

  static addAllToCart() {
    const wishlist = this.getWishlist();
    wishlist.forEach((item) => {
      Cart.addItem(item.productId, 1, item.size, item.color);
    });
    this.clearWishlist();
  }
}
