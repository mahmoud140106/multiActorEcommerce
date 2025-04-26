import { StorageManager } from "./storageManager.js";
import { CategoryManager } from "./categoryManager.js";

export class Product {
  constructor(
    id,
    name,
    categoryId,
    price,
    stock,
    images,
    sellerId,
    {
      description = "",
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
    this.categoryId = categoryId;
    this.price = price;
    this.stock = stock;
    this.images = Array.isArray(images) ? images : [images];
    this.sellerId = sellerId;
    this.description = description;
    this.isOnSale = discount > 0;
    this.discount = discount;
    this.discountedPrice = discount > 0 ? price * (1 - discount) : null;
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

  getCategory() {
    return CategoryManager.getCategory(this.categoryId);
  }
}

export class ProductManager {
  static createProduct(
    id,
    name,
    categoryId,
    price,
    stock,
    images,
    sellerId,
    extraOptions = {}
  ) {
    const product = new Product(
      id,
      name,
      categoryId,
      price,
      stock,
      images,
      sellerId,
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
    categoryId,
    price,
    stock,
    images,
    sellerId,
    extraOptions = {}
  ) {
    let products = StorageManager.load("products") || [];
    products = products.map((product) =>
      product.id === id
        ? new Product(
            id,
            name,
            categoryId,
            price,
            stock,
            images,
            sellerId,
            extraOptions
          )
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

  static getProductsByCategory(categoryId) {
    const products = StorageManager.load("products") || [];
    return products.filter((product) => product.categoryId === categoryId);
  }

  static getProductsBySeller(sellerId) {
    const products = StorageManager.load("products") || [];
    return products.filter((product) => product.sellerId === sellerId);
  }

  static getAllProductsForAdmin() {
    return StorageManager.load("products") || [];
  }
}

function initializeDefaultProducts() {
  const sellerIds = {
    admin: 1,
    sellerOne: 2,
    sellerTwo: 3,
    sellerThree: 4,
  };

  const defaultProducts = [
    new Product(
      1,
      "Cotton T-Shirt",
      1,
      19.99,
      50,
      [
        "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/01/product-image-15-600x600.webp",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      sellerIds.sellerOne,
      {
        description: "Comfortable cotton t-shirt for daily wear.",
        discount: 0.25,
        isFeatured: true,
        brand: "BasicWear",
        colors: ["White", "Black"],
        sizes: ["S", "M", "L"],
        soldCount:5
      }
    ),
    new Product(
      2,
      "Wool Sweater",
      6,
      49.99,
      25,
      [
        "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
      sellerIds.sellerOne,
      {
        description: "Warm and stylish wool sweater.",
        discount: 0.2,
        isFeatured: true,
        brand: "CozyKnit",
        colors: ["Gray", "Navy"],
        sizes: ["M", "L", "XL"],
        soldCount:3
      }
    ),

    new Product(
      3,
      "White Sneakers",
      5,
      59.99,
      30,
      [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
      ],
      sellerIds.sellerOne,
      {
        description: "Trendy white sneakers for casual outfits.",
        isFeatured: true,
        brand: "StepUp",
        colors: ["White"],
        sizes: ["38", "39", "40", "41"],
        soldCount:2
      }
    ),
    new Product(
      4,
      "Polo Shirt",
      1,
      29.99,
      40,
      [
        "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      sellerIds.sellerOne,
      {
        description: "Classic polo shirt for a sporty look.",
        discount: 0.2,
        isFeatured: true,
        brand: "SportyWear",
        colors: ["Red", "Blue", "White"],
        sizes: ["S", "M", "L"],
        soldCount:8
      }
    ),
    new Product(
      5,
      "Denim Jacket",
      3,
      69.99,
      20,
      [
        "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-34-600x600.webp",
        "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      sellerIds.sellerTwo,
      {
        description: "Classic denim jacket for all seasons.",
        discount: 0.15,
        isFeatured: true,
        brand: "UrbanWear",
        colors: ["Blue"],
        sizes: ["M", "L", "XL"],
        soldCount:8
      }
    ),
    new Product(
      6,
      "Black Slim Jeans",
      2,
      39.99,
      40,
      [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.pexels.com/photos/720606/pexels-photo-720606.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
      sellerIds.sellerTwo,
      {
        description: "Slim-fit black jeans for a modern look.",
        isFeatured: true,
        brand: "TrendyFit",
        colors: ["Black"],
        sizes: ["30", "32", "34"],
        soldCount:8
      }
    ),
    new Product(
      7,
      "Floral Skirt",
      4,
      24.99,
      35,
      [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-40.webp",
      ],
      sellerIds.sellerTwo,
      {
        description: "Chic floral skirt for summer outings.",
        isFeatured: true,
        brand: "SummerVibe",
        colors: ["Multicolor"],
        sizes: ["S", "M", "L"],
        soldCount:8
      }
    ),
    new Product(
      8,
      "White shirt",
      1,
      24.99,
      35,
      ["/assets/images/shopping7.jpg", "/assets/images/shopping6.jpg"],
      sellerIds.sellerTwo,
      {
        description: "Chic floral skirt for summer outings.",
        isFeatured: true,
        brand: "SummerVibe",
        colors: ["Multicolor"],
        sizes: ["S", "M", "L"],
        soldCount:8
      }
    ),
  ];

  if (!StorageManager.load("products")) {
    StorageManager.save("products", defaultProducts);
    console.log("initializeDefaultProducts: Default products initialized");
  }
}

initializeDefaultProducts();
