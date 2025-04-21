import { StorageManager } from "./storageManager.js";

export class Product {
  constructor(
    id,
    name,
    category,
    price,
    stock,
    image,
    {
      description = "",
      isOnSale = false,
      discountedPrice = null,
      discount = 0,
      isFeatured = false,
      brand = "",
      colors = [],
      sizes = [],
      createdAt = new Date(),
      updatedAt = new Date(),
      isActive = true,
      sku = "",
      rating = 0,
      numReviews = 0,
      soldCount = 0,
    } = {}
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.image = image;
    this.description = description;
    this.isOnSale = isOnSale;
    this.discountedPrice = discountedPrice;
    this.discount = discount;
    this.isFeatured = isFeatured;
    this.brand = brand;
    this.colors = colors;
    this.sizes = sizes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
    this.sku = sku;
    this.rating = rating;
    this.numReviews = numReviews;
    this.soldCount = soldCount;
  }
}

export class ProductManager {
  static createProduct(
    id,
    name,
    category,
    price,
    stock,
    image,
    extraOptions = {}
  ) {
    const product = new Product(
      id,
      name,
      category,
      price,
      stock,
      image,
      extraOptions
    );
    let products = StorageManager.load("products") || [];
    products.push(product);
    StorageManager.save("products", products);
  }

  static getProduct(id) {
    const products = StorageManager.load("products") || [];
    return products.find((product) => product.id === id);
  }

  static updateProduct(
    id,
    name,
    category,
    price,
    stock,
    image,
    extraOptions = {}
  ) {
    let products = StorageManager.load("products") || [];
    products = products.map((product) =>
      product.id === id
        ? new Product(id, name, category, price, stock, image, extraOptions)
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
    new Product(
      1,
      "Cotton T-Shirt",
      "Shirts",
      19.99,
      50,
      "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/01/product-image-15-600x600.webp",
      {
        isOnSale: true,
        isFeatured: true,
        discountedPrice: 14.99,
      }
    ),
    new Product(
      2,
      "Fames Primis",
      "Sweaters",
      49.99,
      25,
      "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-34-600x600.webp",
      {
        isOnSale: true,
        isFeatured: true,
        discountedPrice: 39.99,
      }
    ),
    new Product(
      3,
      "White Sneakers",
      "Shoes",
      59.99,
      30,
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      { isFeatured: true }
    ),
    new Product(
      4,
      "White Casual T-Shirt",
      "T-Shirts",
      15.99,
      60,
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      { isFeatured: true }
    ),
    new Product(
      5,
      "Black Slim Jeans",
      "Jeans",
      39.99,
      40,

      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      { isFeatured: true }
    ),
    new Product(
      6,
      "Beige Trench Coat",
      "Coats",
      79.99,
      15,
      "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-38.webp",
      { isFeatured: true }
    ),
    new Product(
      7,
      "Gray Track Pants",
      "Pants",
      29.99,
      50,
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    ),
    new Product(
      8,
      "skirt",
      "clothes",
      19.99,
      40,
      "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-40.webp",
      { isFeatured: true }
    ),
    new Product(
      9,
      "Morbi",
      "Shoes",
      19.99,
      40,
      "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/01/product-image-21-600x600.webp",
      { isFeatured: true }
    ),
  ];

  if (!StorageManager.load("products")) {
    StorageManager.save("products", defaultProducts);
  }
}

initializeDefaultProducts();
