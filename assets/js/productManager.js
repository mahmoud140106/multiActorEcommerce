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
      status = "pending",
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
    this.discount = discount > 1 ? discount / 100 : discount;
    this.discountedPrice = this.discount > 0 ? price * (1 - this.discount) : null;
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
    this.status = status;
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
      { ...extraOptions, status: "pending" }
    );
    let products = StorageManager.load("products") || [];
    products.push(product);
    try {
      StorageManager.save("products", products);
    } catch (error) {
      console.error("Failed to save products:", error);
    }
  }

  static getProduct(id) {
    const products =
      StorageManager.load("products").filter(
        (product) => product.status === "accepted"
      ) || [];
    return products.find((product) => product.id === id);
  }

  static getProductsByName(searchName) {
    const productsName =
      StorageManager.load("products").filter(
        (product) => product.status === "accepted"
      ) || [];
    return productsName.filter((product) =>
      product.name.toLowerCase().includes(searchName.toLowerCase())
    );
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
    let product = products.find((product) => product.id == id);
    if (product) {
      product.name = name;
      product.categoryId = categoryId;
      product.price = price;
      product.stock = stock;
      product.images = images;
      product.sellerId = sellerId;
      Object.assign(product, extraOptions);
      product.isOnSale = product.discount > 0;
      product.discountedPrice = product.discount > 0 ? product.price * (1 - product.discount) : null;
      product.updatedAt = new Date();
      try {
        StorageManager.save("products", products);
      } catch (error) {
        console.error("Failed to save products:", error);
      }
    }
  }

  static updateProductStatus(productId, newStatus) {
    let products = StorageManager.load("products") || [];
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex].status = newStatus;
      products[productIndex].updatedAt = new Date();
      try {
        StorageManager.save("products", products);
      } catch (error) {
        console.error("Failed to save products:", error);
      }
      if (newStatus !== "accepted") {
        ProductManager.updateFeaturedProducts();
      }
    }
  }

  static sendNotification(userId, message) {
    let notifications = StorageManager.load("notifications") || [];
    const notification = {
      id: notifications.length + 1,
      userId,
      message,
      createdAt: new Date(),
      isRead: false,
    };
    notifications.push(notification);
    try {
      StorageManager.save("notifications", notifications);
    } catch (error) {
      console.error("Failed to save notifications:", error);
    }
  }

  static getNotificationsForSeller(userId) {
    const notifications = StorageManager.load("notifications") || [];
    return notifications.filter(
      (notification) => notification.userId === userId
    );
  }

  static deleteProduct(id) {
    let products = StorageManager.load("products") || [];
    products = products.filter((product) => product.id !== id);
    try {
      StorageManager.save("products", products);
    } catch (error) {
      console.error("Failed to save products:", error);
    }
  }

  static getAllProducts() {
    return (
      StorageManager.load("products").filter(
        (product) => product.status === "accepted"
      ) || []
    );
  }

  static getProductsByCategory(categoryId) {
    const products =
      StorageManager.load("products").filter(
        (product) => product.status === "accepted"
      ) || [];
    return products.filter((product) => product.categoryId === categoryId);
  }

  static getProductsBySeller(sellerId) {
    const products = StorageManager.load("products") || [];
    return products.filter((product) => product.sellerId === sellerId);
  }

  static getAllProductsForAdmin() {
    return StorageManager.load("products") || [];
  }

  static checkStockAvailability(productId, desiredQuantity = 1) {
    const products = StorageManager.load("products") || [];
    const product = products.find(
      (p) => p.id === productId && p.status === "accepted"
    );

    if (!product) {
      return {
        available: false,
        stock: 0,
        message: "Product not found or not available.",
      };
    }

    if (product.stock >= desiredQuantity) {
      return { available: true, stock: product.stock };
    } else {
      return {
        available: false,
        stock: product.stock,
        message: `Only ${product.stock} item(s) available in stock.`,
      };
    }
  }

  static updateStock(productId, quantityChange) {
    const products = StorageManager.load("products") || [];
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex !== -1) {
      products[productIndex].stock += quantityChange;
      try {
        StorageManager.save("products", products);
      } catch (error) {
        console.error("Failed to save products:", error);
      }
    }
  }

  /**
   * Updates the isFeatured property for the top 8 products based on soldCount and rating.
   * Only products with status "accepted" can be featured.
   */
  static updateFeaturedProducts() {
    let products = StorageManager.load("products");
    if (!products || !Array.isArray(products)) {
      console.error("Failed to load products or products is not an array");
      return;
    }
    products.sort((a, b) => {
      if (b.soldCount !== a.soldCount) {
        return b.soldCount - a.soldCount;
      }
      return b.rating - a.rating;
    });
    products = products.map((product, index) => {
      product.isFeatured = index < 8 && product.status === "accepted";
      product.updatedAt = new Date();
      return product;
    });
    try {
      StorageManager.save("products", products);
    } catch (error) {
      console.error("Failed to save products:", error);
    }
  }

  /**
   * Retrieves all products that are marked as featured and have status "accepted".
   * @returns {Array} List of featured products.
   */
  static getFeaturedProducts() {
    return (
      StorageManager.load("products").filter(
        (product) => product.status === "accepted" && product.isFeatured
      ) || []
    );
  }
}

function initializeDefaultProducts() {
  const defaultProducts = [
    new Product(
      13,
      "Double-Breasted Wool Coat",
      1, // Category: COAT
      99.99,
      18, // Stock count
      [
        "/assets/images/coat (4).jpg",
        "/assets/images/coat (5).jpg",
        "/assets/images/coat (6).jpg",
      ],
      2, // Seller: 2
      {
        description:
          "Elegant double-breasted wool coat with a tailored fit, offering warmth and sophistication for cold seasons.",
        discount: 0.1, // Changed from 10 to 0.1
        brand: "PremiumStyle",
        colors: ["Camel", "Black"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 85,
        status: "accepted",
      }
    ),

    new Product(
      14,
      "Formal Charcoal Blazer",
      2, // Category: BLAZER
      89.99,
      20, // Stock count
      [
        "/assets/images/blazer (4).jpg",
        "/assets/images/blazer (5).jpg",
        "/assets/images/blazer (6).jpg",
      ],
      3, // Seller: 3
      {
        description:
          "Sophisticated charcoal blazer designed for formal and business attire, offering comfort and a polished look.",
        discount: 0.15, // Changed from 15 to 0.15
        brand: "ExecutiveWear",
        colors: ["Charcoal", "Navy"],
        sizes: ["M", "L", "XL"],
        soldCount: 75,
        status: "accepted",
      }
    ),

    new Product(
      15,
      "Distressed Denim Pants",
      3, // Category: DENIM PANTS
      49.99,
      35, // Stock count
      [
        "/assets/images/denim pants (4).jpg",
        "/assets/images/denim pants (5).jpg",
        "/assets/images/denim pants (6).jpg",
      ],
      1, // Seller: 1
      {
        description:
          "Trendy distressed denim pants with a relaxed fit, perfect for a casual streetwear aesthetic.",
        discount: 0.05, // Changed from 5 to 0.05
        brand: "UrbanEdge",
        colors: ["Light Blue", "Dark Blue"],
        sizes: ["30", "32", "34", "36"],
        soldCount: 95,
        status: "accepted",
      }
    ),

    new Product(
      16,
      "Water-Resistant Puffer Jacket",
      4, // Category: JACKET
      79.99,
      25, // Stock count
      [
        "/assets/images/jacket (4).jpg",
        "/assets/images/jacket (5).jpg",
      ],
      2, // Seller: 2
      {
        description:
          "Lightweight water-resistant puffer jacket designed for warmth and comfort during colder days.",
        discount: 0.1, // Changed from 10 to 0.1
        brand: "OutdoorGear",
        colors: ["Black", "Navy", "Olive"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 80,
        status: "accepted",
      }
    ),

    new Product(
      17,
      "Cozy Fleece Sweatshirt",
      5, // Category: SWEATSHIRT
      44.99,
      22, // Stock count
      [
        "/assets/images/sweatshirt (4).jpg",
        "/assets/images/sweatshirt (5).jpg",
        "/assets/images/sweatshirt (6).jpg",
      ],
      3, // Seller: 3
      {
        description:
          "Comfortable fleece sweatshirt with an oversized fit, ideal for casual lounge wear.",
        discount: 0, // Remains 0
        brand: "WarmEssentials",
        colors: ["Gray", "Blue", "Burgundy"],
        sizes: ["XS", "S", "M", "L"],
        soldCount: 110,
        status: "accepted",
      }
    ),
    new Product(
      18,
      "Slim Fit Herringbone Blazer",
      2, // Category: BLAZER
      94.99,
      28, // Stock count
      [
        "/assets/images/blazer (7).jpg",
        "/assets/images/blazer (8).jpg",
        "/assets/images/blazer (9).jpg",
      ],
      1, // Seller: 1
      {
        description:
          "Refined herringbone blazer with a slim-cut design, perfect for business meetings or upscale events.",
        discount: 0.1, // Changed from 10 to 0.1
        brand: "ExecutiveStyle",
        colors: ["Gray", "Black"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 65,
        status: "accepted",
      }
    ),

    new Product(
      19,
      "Distressed Slim Denim Jeans",
      3, // Category: DENIM PANTS
      59.99,
      30, // Stock count
      [
        "/assets/images/denim pants (7).jpg",
        "/assets/images/denim pants (8).jpg",
        "/assets/images/denim pants (9).jpg",
      ],
      2, // Seller: 2
      {
        description:
          "Stylish distressed slim-fit denim jeans, crafted with stretch fabric for a comfortable fit.",
        discount: 0.05, // Changed from 5 to 0.05
        brand: "DenimEdge",
        colors: ["Blue", "Gray"],
        sizes: ["30", "32", "34", "36"],
        soldCount: 90,
        status: "accepted",
      }
    ),

    new Product(
      20,
      "Casual Quilted Jacket",
      4, // Category: JACKET
      72.99,
      22, // Stock count
      [
        "/assets/images/jacket (1).jpg",
        "/assets/images/jacket (2).jpg",
        "/assets/images/jacket (3).jpg",
      ],
      3, // Seller: 3
      {
        description:
          "Lightweight quilted jacket with an insulated interior, ideal for chilly outdoor adventures.",
        discount: 0.15, // Changed from 15 to 0.15
        brand: "OutdoorEssentials",
        colors: ["Black", "Olive"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 78,
        status: "accepted",
      }
    ),

    new Product(
      21,
      "Streetwear Printed Sweatshirt",
      5, // Category: SWEATSHIRT
      39.99,
      26, // Stock count
      [
        "/assets/images/sweatshirt (7).jpg",
        "/assets/images/sweatshirt (8).jpg",
      ],
      1, // Seller: 1
      {
        description:
          "Trendy printed sweatshirt designed for urban streetwear fashion, offering comfort and style.",
        discount: 0, // Remains 0
        brand: "StreetFusion",
        colors: ["Black", "White"],
        sizes: ["XS", "S", "M", "L"],
        soldCount: 105,
        status: "accepted",
      }
    ),

    new Product(
      22,
      "Classic Button-Up Flannel Shirt",
      6, // Category: FLANNEL SHIRT
      34.99,
      24, // Stock count
      [
        "/assets/images/flannel shirt (1).jpg",
        "/assets/images/flannel shirt (2).jpg",
        "/assets/images/flannel shirt (3).jpg",
        "/assets/images/flannel shirt (4).jpg",
      ],
      2, // Seller: 2
      {
        description:
          "Soft and breathable button-up flannel shirt, designed for timeless casual looks.",
        discount: 0.05, // Changed from 5 to 0.05
        brand: "RusticStyle",
        colors: ["Red", "Green", "Navy"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 88,
        status: "accepted",
      }
    ),

    new Product(
      23,
      "Lightweight Summer Vest",
      7, // Category: CASUAL VEST
      27.99,
      32, // Stock count
      [
        "/assets/images/casual vest (1).jpg",
        "/assets/images/casual vest (2).jpg",
      ],
      3, // Seller: 3
      {
        description:
          "Breathable summer vest with a lightweight fabric blend, ideal for casual layering.",
        discount: 0.1, // Changed from 10 to 0.1
        brand: "EasyWear",
        colors: ["Beige", "Light Gray"],
        sizes: ["S", "M", "L"],
        soldCount: 70,
        status: "accepted",
      }
    ),
    new Product(
      24,
      "Formal Cotton Shirt",
      8, // Category: SHIRT
      42.99,
      29, // Stock count
      [
        "/assets/images/shirt (1).jpg",
        "/assets/images/shirt (2).jpg",
        "/assets/images/shirt (3).jpg",
      ],
      1, // Seller: 1
      {
        description:
          "Classic formal cotton shirt with a tailored fit, ideal for office wear or special occasions.",
        discount: 0.1, // Changed from 10 to 0.1
        brand: "EliteWear",
        colors: ["White", "Light Blue", "Gray"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 95,
        status: "accepted",
      }
    ),

    new Product(
      25,
      "Graphic Printed T-Shirt",
      9, // Category: TSHIRT
      26.99,
      33, // Stock count
      [
        "/assets/images/tshirt (4).jpg",
        "/assets/images/tshirt (5).jpg",
        "/assets/images/tshirt (6).jpg",
      ],
      2, // Seller: 2
      {
        description:
          "Vibrant graphic printed t-shirt with breathable fabric, designed for daily casual wear.",
        discount: 0, // Remains 0
        brand: "StreetCulture",
        colors: ["Black", "White", "Red"],
        sizes: ["M", "L", "XL"],
        soldCount: 120,
        status: "accepted",
      }
    ),

    new Product(
      26,
      "Straight-Leg Chinos",
      10, // Category: CHINOS
      39.99,
      31, // Stock count
      [
        "/assets/images/chinos (4).jpg",
        "/assets/images/chinos (5).jpg",
        "/assets/images/chinos (6).jpg",
      ],
      3, // Seller: 3
      {
        description:
          "Comfortable straight-leg chinos, perfect for both casual and semi-formal wear.",
        discount: 0.05, // Changed from 5 to 0.05
        brand: "ModernFit",
        colors: ["Khaki", "Navy", "Black"],
        sizes: ["30", "32", "34", "36"],
        soldCount: 110,
        status: "accepted",
      }
    ),

    new Product(
      27,
      "Casual Sneakers",
      11, // Category: SHOES
      64.99,
      20, // Stock count
      [
        "/assets/images/shoes (4).jpg",
        "/assets/images/shoes (5).jpg",
        "/assets/images/shoes (6).jpg",
      ],
      1, // Seller: 1
      {
        description:
          "Comfortable everyday sneakers with a stylish design, perfect for casual outings.",
        discount: 0.1, // Changed from 10 to 0.1
        brand: "UrbanFeet",
        colors: ["White", "Black", "Gray"],
        sizes: ["8", "9", "10", "11"],
        soldCount: 95,
        status: "accepted",
      }
    ),

    new Product(
      28,
      "Soft Knit Sweater",
      12, // Category: SWEATER
      55.99,
      27, // Stock count
      [
        "/assets/images/sweater (4).jpg",
        "/assets/images/sweater (5).jpg",
        "/assets/images/sweater (6).jpg",
      ],
      2, // Seller: 2
      {
        description:
          "Warm and stylish knit sweater with a relaxed fit, ideal for cold seasons.",
        discount: 0.15, // Changed from 15 to 0.15
        brand: "CozyThreads",
        colors: ["Gray", "Navy", "Burgundy"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 78,
        status: "accepted",
      }
    ),
  ];

  if (!StorageManager.load("products")) {
    StorageManager.save("products", defaultProducts);
    console.log("initializeDefaultProducts: Default products initialized");
    ProductManager.updateFeaturedProducts(); // Update featured products after initialization
  }
}

initializeDefaultProducts();