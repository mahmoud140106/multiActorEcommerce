import { StorageManager } from './storageManager.js';

export class Product {
  constructor(id, name, category, price, stock, image) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.image = image;
  }
}

export class ProductManager {
  static createProduct(id, name, category, price, stock, image) {
    const product = new Product(id, name, category, price, stock, image);
    let products = StorageManager.load("products") || [];
    products.push(product);
    StorageManager.save("products", products);
  }

  static getProduct(id) {
    const products = StorageManager.load("products") || [];
    return products.find((product) => product.id === id);
  }

  static updateProduct(id, name, category, price, stock, image) {
    let products = StorageManager.load("products") || [];
    products = products.map((product) =>
      product.id === id
        ? new Product(id, name, category, price, stock, image)
        : product
    );
    StorageManager.save("products", products);
  }

  static deleteProduct(id) {
    let products = StorageManager.load("products") || [];
    products = products.filter((product) => product.id !== id);
    StorageManager.save("products", products);
  }

  static getAllProducts() {
    return StorageManager.load("products") || [];
  }
}
function initializeDefaultProducts() {
  const defaultProducts = [
    new Product(1, "Cotton T-Shirt", "Shirts", 19.99, 50, "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),
    new Product(16, "Cardigan", "Sweaters", 49.99, 25, "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),
    new Product(18, "White Sneakers", "Shoes", 59.99, 30, "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),

    new Product(1, "White Casual T-Shirt", "T-Shirts", 15.99, 60, "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),
    new Product(2, "Black Slim Jeans", "Jeans", 39.99, 40, "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),
    new Product(11, "Beige Trench Coat", "Coats", 79.99, 15, "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),
    new Product(15, "Gray Track Pants", "Pants", 29.99, 50, "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),
    new Product(16, "White Sneakers", "Shoes", 59.99, 30, "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),

    new Product(24, "Wool Scarf", "Accessories", 19.99, 40, "https://images.unsplash.com/photo-1514996937319-344454492b37?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"),
   ];

  if(!StorageManager.load("products")) {
    StorageManager.save("products", defaultProducts);
  }
}

initializeDefaultProducts();