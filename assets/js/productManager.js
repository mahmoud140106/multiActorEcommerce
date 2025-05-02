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
    StorageManager.save("products", products);
  }

  static getProduct(id) {
    const products = StorageManager.load("products").filter((product) => product.status === "accepted") || [];
    return products.find((product) => product.id === id);
  }

  static getProductsByName(searchName) {
    const productsName = StorageManager.load("products").filter((product) => product.status === "accepted") || [];
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
    // products = products.map((product) =>
    //   product.id === id
    //     ? new Product(
    //         id,
    //         name,
    //         categoryId,
    //         price,
    //         stock,
    //         images,
    //         sellerId,
    //         extraOptions
    //       )
    //     : product
    // );
    let product=products.find(product=> product.id==id);
    product.name=name;
    product.categoryId=categoryId;
    product.price=price;
    product.stock=stock;
    product.images=images;
    product.sellerId=sellerId;
    product.extraOptions=extraOptions;

    StorageManager.save("products", products);
  }

  static updateProductStatus(productId, newStatus) {
    let products = StorageManager.load("products") || [];
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex].status = newStatus;
      products[productIndex].updatedAt = new Date();
      StorageManager.save("products", products);
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
    StorageManager.save("notifications", notifications);
  }

  static getNotificationsForSeller(userId) {
    const notifications = StorageManager.load("notifications") || [];
    return notifications.filter(notification => notification.userId === userId);
  }

  static deleteProduct(id) {
    let products = StorageManager.load("products") || [];
    products = products.filter((product) => product.id !== id);
    StorageManager.save("products", products);
  }

  static getAllProducts() {
    return (
      StorageManager.load("products").filter(
        (product) => product.status === "accepted"
      ) || []
    );
  }

  static getProductsByCategory(categoryId) {
    const products = StorageManager.load("products").filter((product) => product.status === "accepted") || [];
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
    const product = products.find((p) => p.id === productId && p.status === "accepted");
  
    if (!product) {
      return { available: false, stock: 0, message: "Product not found or not available." };
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
      StorageManager.save("products", products);
    }
  }
}

function initializeDefaultProducts() {
  // Helper functions for randomization
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomFloat = (min, max, decimals = 2) => Number((Math.random() * (max - min) + min).toFixed(decimals));
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const randomSubset = (array, minItems, maxItems) => {
    const count = randomInt(minItems, maxItems);
    return shuffleArray([...array]).slice(0, count);
  };

  // Available attributes
  const sellers = [2, 3, 4, 8, 11, 14]; // Mahmoud, Omar, Farah, Aya, Hassan, Rania
  const categories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // COAT to SHOES
  const brands = ["BasicWear", "CozyKnit", "StepUp", "SportyWear", "UrbanWear", "TrendyFit", "SummerVibe"];
  const sizes = ["S", "M", "L", "XL"];
  const shoeSizes = ["38", "39", "40", "41", "42"];
  const colors = ["Black", "White", "Navy", "Gray", "Blue", "Red", "Green", "Beige", "Multicolor"];

  // Product names by category
  const productNamesByCategory = {
    1: ["Wool Coat", "Trench Coat", "Pea Coat", "Parka"],
    2: ["Slim Fit Blazer", "Double-Breasted Blazer", "Casual Blazer"],
    3: ["Slim Jeans", "Ripped Jeans", "Straight Denim", "Bootcut Jeans"],
    4: ["Denim Jacket", "Bomber Jacket", "Puffer Jacket"],
    5: ["Crewneck Sweatshirt", "Hooded Sweatshirt", "Graphic Sweatshirt"],
    6: ["Plaid Flannel", "Checked Flannel", "Soft Flannel Shirt"],
    7: ["Quilted Vest", "Padded Vest", "Lightweight Vest"],
    8: ["Button-Up Shirt", "Oxford Shirt", "Dress Shirt"],
    9: ["Cotton T-Shirt", "Graphic Tee", "V-Neck Tee"],
    10: ["Slim Chinos", "Casual Chinos", "Tapered Chinos"],
    11: ["Sneakers", "Loafers", "Dress Shoes", "Boots"],
  };

  // Image sets by category (3 images each)
  const imageSetsByCategory = {
    1: [
      "https://images.unsplash.com/photo-1517524206122-6112d908f5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/6858498/pexels-photo-6858498.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    2: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    3: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/720606/pexels-photo-720606.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    4: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1604644401890-925ff4e6bd10?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    5: [
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/5705497/pexels-photo-5705497.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    6: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1604001344366-4c23f3fd73eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    7: [
      "https://images.unsplash.com/photo-1601330846797-5d8034568b14?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/6858499/pexels-photo-6858499.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1601330846797-5d8034568b14?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    8: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    9: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/9558609/pexels-photo-9558609.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    10: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1517438476312-10d79c077509?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
    11: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
      "https://images.unsplash.com/photo-1605733513597-a8f834bd2fac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ],
  };

  // Generate 30 products
  const defaultProducts = Array.from({ length: 30 }, (_, index) => {
    const id = index + 1;
    const categoryId = categories[randomInt(0, categories.length - 1)];
    const name = productNamesByCategory[categoryId][randomInt(0, productNamesByCategory[categoryId].length - 1)];
    const price = randomFloat(10, 100, 2);
    const discount = index < 20 ? 0 : randomFloat(0.1, 0.6, 2);
    const stock = randomInt(0, 40);
    const sellerId = sellers[randomInt(0, sellers.length - 1)];
    const isFeatured = index < 8; // First 8 products are featured
    const brand = brands[randomInt(0, brands.length - 1)];
    const soldCount = Math.min(randomInt(1, 10), stock + randomInt(1, 10)); // Ensure soldCount is logical
    const isShoes = categoryId === 11;
    const productSizes = isShoes ? randomSubset(shoeSizes, 2, 5) : randomSubset(sizes, 1, 4);
    const productColors = randomSubset(colors, 1, 3);
    const images = imageSetsByCategory[categoryId];

    // Generate description based on name and category
    const descriptions = {
      "Wool Coat": "Warm and stylish wool coat, perfect for winter.",
      "Trench Coat": "Classic trench coat for a timeless look.",
      "Pea Coat": "Navy-inspired pea coat with a modern fit.",
      "Parka": "Insulated parka for extreme cold weather.",
      "Slim Fit Blazer": "Tailored blazer for a sharp, professional style.",
      "Double-Breasted Blazer": "Elegant double-breasted blazer for formal occasions.",
      "Casual Blazer": "Versatile blazer for smart-casual outfits.",
      "Slim Jeans": "Slim-fit denim jeans for a modern silhouette.",
      "Ripped Jeans": "Trendy ripped jeans for a bold, casual look.",
      "Straight Denim": "Classic straight-cut denim for everyday wear.",
      "Bootcut Jeans": "Bootcut jeans with a slight flare for versatility.",
      "Denim Jacket": "Durable denim jacket for a rugged style.",
      "Bomber Jacket": "Sleek bomber jacket for a contemporary vibe.",
      "Puffer Jacket": "Warm puffer jacket for cold-weather comfort.",
      "Crewneck Sweatshirt": "Cozy crewneck sweatshirt for casual wear.",
      "Hooded Sweatshirt": "Comfortable hooded sweatshirt with drawstrings.",
      "Graphic Sweatshirt": "Stylish sweatshirt with bold graphic print.",
      "Plaid Flannel": "Soft plaid flannel shirt for a rustic look.",
      "Checked Flannel": "Classic checked flannel for everyday comfort.",
      "Soft Flannel Shirt": "Lightweight flannel shirt for layering.",
      "Quilted Vest": "Warm quilted vest for outdoor adventures.",
      "Padded Vest": "Padded vest for extra warmth without bulk.",
      "Lightweight Vest": "Lightweight vest for transitional weather.",
      "Button-Up Shirt": "Crisp button-up shirt for versatile styling.",
      "Oxford Shirt": "Traditional oxford shirt for a preppy look.",
      "Dress Shirt": "Formal dress shirt for business settings.",
      "Cotton T-Shirt": "Soft cotton t-shirt for daily wear.",
      "Graphic Tee": "Vibrant graphic tee for a fun, casual style.",
      "V-Neck Tee": "Comfortable v-neck t-shirt for a relaxed fit.",
      "Slim Chinos": "Slim-fit chinos for a polished casual look.",
      "Casual Chinos": "Relaxed chinos for everyday versatility.",
      "Tapered Chinos": "Tapered chinos for a modern, fitted style.",
      "Sneakers": "Trendy sneakers for casual and athletic wear.",
      "Loafers": "Sleek loafers for a sophisticated look.",
      "Dress Shoes": "Polished dress shoes for formal occasions.",
      "Boots": "Rugged boots for outdoor and casual wear.",
    };

    return new Product(
      id,
      name,
      categoryId,
      price,
      stock,
      images,
      sellerId,
      {
        description: descriptions[name] || `Stylish ${name.toLowerCase()} for all occasions.`,
        discount,
        isFeatured,
        brand,
        colors: productColors,
        sizes: productSizes,
        soldCount,
        status: "accepted",
        sku: `SKU-${id}-${name.replace(/\s+/g, '-')}`,
      }
    );
  });

  if (!StorageManager.load("products")) {
    StorageManager.save("products", defaultProducts);
    console.log("initializeDefaultProducts: Default products initialized");
  }
}

initializeDefaultProducts();