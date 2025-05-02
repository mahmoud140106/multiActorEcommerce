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
    let product = products.find((product) => product.id == id);
    product.name = name;
    product.categoryId = categoryId;
    product.price = price;
    product.stock = stock;
    product.images = images;
    product.sellerId = sellerId;
    product.extraOptions = extraOptions;

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
    return notifications.filter(
      (notification) => notification.userId === userId
    );
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
      StorageManager.save("products", products);
    }
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
        discount: 10,
        isFeatured: true,
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
        discount: 15,
        isFeatured: true,
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
        discount: 5,
        isFeatured: false,
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
        discount: 10,
        isFeatured: true,
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
        discount: 0,
        isFeatured: false,
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
        discount: 10,
        isFeatured: true,
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
        discount: 5,
        isFeatured: false,
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
        discount: 15,
        isFeatured: true,
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
        discount: 0,
        isFeatured: false,
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
        discount: 5,
        isFeatured: false,
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
        discount: 10,
        isFeatured: false,
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
        discount: 10,
        isFeatured: true,
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
        discount: 0,
        isFeatured: false,
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
        discount: 5,
        isFeatured: true,
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
        discount: 10,
        isFeatured: true,
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
        discount: 15,
        isFeatured: true,
        brand: "CozyThreads",
        colors: ["Gray", "Navy", "Burgundy"],
        sizes: ["S", "M", "L", "XL"],
        soldCount: 78,
        status: "accepted",
      }
    ),
  ];
  // const defaultProducts = [
  //   new Product(
  //     1,
  //     "Classic Wool Coat",
  //     1, // Category: COAT
  //     89.99,
  //     20,
  //     [
  //       "/assets/images/coat (1).jpg",
  //       "/assets/images/coat (2).jpg",
  //       "/assets/images/coat (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Timeless wool coat featuring a structured silhouette and a warm, luxurious feel. Perfect for chilly evenings or stylish layering.",
  //       discount: 0.1,
  //       isFeatured: true,
  //       brand: "UrbanStyle",
  //       colors: ["Black", "Navy"],
  //       sizes: ["S", "M", "L", "XL"],
  //       soldCount: 65,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     2,
  //     "Tailored Navy Blazer",
  //     2, // Category: BLAZER
  //     79.99,
  //     25,
  //     [
  //       "/assets/images/blazer (1).jpg",
  //       "/assets/images/blazer (2).jpg",
  //       "/assets/images/blazer (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Sharp and stylish navy blazer tailored for a sleek silhouette. Ideal for formal occasions or elevated casual looks.",
  //       discount: 0.15,
  //       isFeatured: true,
  //       brand: "EliteWear",
  //       colors: ["Navy", "Charcoal"],
  //       sizes: ["S", "M", "L", "XL"],
  //       soldCount: 45,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     3,
  //     "Slim-Fit Black Jeans",
  //     3, // Category: DENIM PANTS
  //     49.99,
  //     35,
  //     [
  //       "/assets/images/denim pants (1).jpg",
  //       "/assets/images/denim pants (2).jpg",
  //       "/assets/images/denim pants (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Sleek slim-fit black jeans, designed for a modern wardrobe with a tailored cut that enhances comfort and style. Made from stretch denim, ideal for both casual and semi-formal occasions.",
  //       discount: 0,
  //       isFeatured: true,
  //       brand: "TrendyDenim",
  //       colors: ["Black"],
  //       sizes: ["30", "32", "34", "36"],
  //       soldCount: 110,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     4,
  //     "Windproof Hooded Jacket",
  //     4, // Category: JACKET
  //     59.99,
  //     18,
  //     [
  //       "/assets/images/jacket (1).jpg",
  //       "/assets/images/jacket (2).jpg",
  //       "/assets/images/jacket (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Durable hooded jacket with windproof technology, designed for outdoor adventures and urban comfort. Features a sleek design with practical pockets.",
  //       discount: 0.2,
  //       isFeatured: false,
  //       brand: "AdventureGear",
  //       colors: ["Olive", "Black", "Gray"],
  //       sizes: ["M", "L", "XL"],
  //       soldCount: 85,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     5,
  //     "Oversized Cotton Sweatshirt",
  //     5, // Category: SWEATSHIRT
  //     39.99,
  //     15,
  //     [
  //       "/assets/images/sweatshirt (1).jpg",
  //       "/assets/images/sweatshirt (2).jpg",
  //       "/assets/images/sweatshirt (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Comfy oversized sweatshirt with breathable cotton fabric, featuring a modern relaxed fit. Ideal for casual wear and cozy days.",
  //       discount: 0.05,
  //       isFeatured: false,
  //       brand: "CozyWear",
  //       colors: ["Beige", "Gray", "Blue"],
  //       sizes: ["XS", "S", "M", "L"],
  //       soldCount: 120,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     6,
  //     "Zip-Up Hoodie with Pockets",
  //     6, // Category: HOODIE
  //     44.99,
  //     22,
  //     [
  //       "/assets/images/hoodie (1).jpg",
  //       "/assets/images/hoodie (2).jpg",
  //       "/assets/images/hoodie (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Stylish zip-up hoodie with spacious front pockets, crafted from a soft cotton blend for all-day comfort. Perfect for layering or casual outings.",
  //       discount: 0.1,
  //       isFeatured: true,
  //       brand: "UrbanComfort",
  //       colors: ["Gray", "Black", "Navy"],
  //       sizes: ["S", "M", "L", "XL"],
  //       soldCount: 90,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     7,
  //     "Padded Casual Vest",
  //     7, // Category: CASUAL VEST
  //     59.99,
  //     20,
  //     [
  //       "/assets/images/casual vest (1).jpg",
  //       "/assets/images/casual vest (2).jpg",
  //       "/assets/images/casual vest (3).jpg",
  //     ],
  //     11, // Seller: Hassan Youssef
  //     {
  //       description:
  //         "Lightweight padded casual vest, perfect for layering in cool weather with a quilted design for added warmth. Features a water-resistant finish, ideal for outdoor activities.",
  //       discount: 0,
  //       isFeatured: true,
  //       brand: "OutdoorLayer",
  //       colors: ["Black", "Olive"],
  //       sizes: ["S", "M", "L"],
  //       soldCount: 50,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     8,
  //     "Flannel Plaid Shirt",
  //     8, // Category: SHIRT
  //     29.99,
  //     35,
  //     [
  //       "/assets/images/flannel shirt (1).jpg",
  //       "/assets/images/flannel shirt (2).jpg",
  //       "/assets/images/flannel shirt (3).jpg",
  //     ],
  //     8, // Seller: Aya Nour
  //     {
  //       description:
  //         "Cozy flannel plaid shirt with a classic pattern, made from soft cotton for warmth and comfort. Ideal for outdoor activities or a relaxed day, with a button-down front and chest pockets.",
  //       discount: 0.1,
  //       isFeatured: true,
  //       brand: "RusticWear",
  //       colors: ["Red", "Blue", "Green"],
  //       sizes: ["S", "M", "L", "XL"],
  //       soldCount: 70,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     9,
  //     "Premium Graphic T-Shirt",
  //     9, // Category: TSHIRT
  //     24.99,
  //     50,
  //     [
  //       "/assets/images/tshirt (1).jpg",
  //       "/assets/images/tshirt (2).jpg",
  //       "/assets/images/tshirt (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Soft and breathable graphic tee with vibrant designs. Made for ultimate comfort with lightweight fabric, perfect for casual wear.",
  //       discount: 0,
  //       isFeatured: false,
  //       brand: "StreetStyle",
  //       colors: ["White", "Black", "Red"],
  //       sizes: ["M", "L", "XL"],
  //       soldCount: 200,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     10,
  //     "Slim Fit Chinos",
  //     10, // Category: CHINOS
  //     44.99,
  //     30,
  //     [
  //       "/assets/images/chinos (1).jpg",
  //       "/assets/images/chinos (2).jpg",
  //       "/assets/images/chinos (3).jpg",
  //     ],
  //     4, // Seller: Farah Alaa
  //     {
  //       description:
  //         "Elegant slim fit chinos with a soft fabric blend for versatile styling. Perfect for both office and casual wear with a polished look.",
  //       discount: 0.1,
  //       isFeatured: true,
  //       brand: "ClassicWear",
  //       colors: ["Khaki", "Navy", "Black"],
  //       sizes: ["30", "32", "34", "36"],
  //       soldCount: 130,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     11,
  //     "Leather White Sneakers",
  //     11, // Category: SHOES
  //     89.99,
  //     25,
  //     [
  //       "/assets/images/shoes (1).jpg",
  //       "/assets/images/shoes (2).jpg",
  //       "/assets/images/shoes (3).jpg",
  //     ],
  //     3, // Seller: Omar Khaled
  //     {
  //       description:
  //         "Stylish white leather sneakers, handcrafted with premium leather for a sleek, modern look. Offers excellent cushioning and durability, ideal for casual walks and active lifestyles.",
  //       discount: 0.1,
  //       isFeatured: true,
  //       brand: "UrbanStep",
  //       colors: ["White"],
  //       sizes: ["38", "39", "40", "41", "42"],
  //       soldCount: 60,
  //       status: "accepted",
  //     }
  //   ),
  //   new Product(
  //     12,
  //     "Wool Cable-Knit Sweater",
  //     12, // Category: SWEATER
  //     79.99,
  //     30,
  //     [
  //       "/assets/images/sweater (1).jpg",
  //       "/assets/images/sweater (2).jpg",
  //       "/assets/images/sweater (3).jpg",
  //     ],
  //     2, // Seller: Mahmoud Taha
  //     {
  //       description:
  //         "Cozy wool cable-knit sweater, crafted with premium quality yarn for warmth and durability. Features a classic design with intricate patterns, perfect for chilly days or elegant winter evenings.",
  //       discount: 0.15,
  //       isFeatured: true,
  //       brand: "WarmKnit",
  //       colors: ["Navy", "Gray", "Green"],
  //       sizes: ["M", "L", "XL"],
  //       soldCount: 85,
  //       status: "accepted",
  //     }
  //   ),
  // ];

  if (!StorageManager.load("products")) {
    StorageManager.save("products", defaultProducts);
    console.log("initializeDefaultProducts: Default products initialized");
  }
}

initializeDefaultProducts();
