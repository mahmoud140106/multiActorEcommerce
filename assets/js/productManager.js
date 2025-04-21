import { StorageManager } from "./storageManager.js";

export class Product {
  constructor(
    id,
    name,
    category,
    price,
    stock,
    images,
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
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.images = Array.isArray(images) ? images : [images];
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
}

export class ProductManager {
  static createProduct(
    id,
    name,
    category,
    price,
    stock,
    images,
    extraOptions = {}
  ) {
    const product = new Product(
      id,
      name,
      category,
      price,
      stock,
      images,
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
    images,
    extraOptions = {}
  ) {
    let products = StorageManager.load("products") || [];
    products = products.map((product) =>
      product.id === id
        ? new Product(id, name, category, price, stock, images, extraOptions)
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
  // const defaultProducts = [
  //   new Product(
  //     1,
  //     "Cotton T-Shirt",
  //     "Shirts",
  //     19.99,
  //     50,
  //     [
  //       "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/01/product-image-15-600x600.webp",
  //     ],
  //     { discount: 0.25, isFeatured: true }
  //   ),
  //   new Product(
  //     2,
  //     "Fames Primis",
  //     "Sweaters",
  //     49.99,
  //     25,
  //     [
  //       "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //     ],
  //     { discount: 0.2, isFeatured: true }
  //   ),
  //   new Product(
  //     3,
  //     "White Sneakers",
  //     "Shoes",
  //     59.99,
  //     30,
  //     [
  //       "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //       "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //     ],
  //     { isFeatured: true }
  //   ),
  //   new Product(
  //     4,
  //     "White Casual T-Shirt",
  //     "T-Shirts",
  //     15.99,
  //     60,
  //     [
  //       "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //       "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-38.webp",
  //     ],
  //     { isFeatured: true }
  //   ),
  //   new Product(
  //     5,
  //     "Black Slim Jeans",
  //     "Jeans",
  //     39.99,
  //     40,
  //     [
  //       "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //       "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //     ],
  //     { isFeatured: true }
  //   ),
  //   new Product(
  //     6,
  //     "Beige Trench Coat",
  //     "Coats",
  //     79.99,
  //     15,
  //     [
  //       "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-38.webp",
  //       "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //     ],
  //     { isFeatured: true }
  //   ),
  //   new Product(7, "Gray Track Pants", "Pants", 29.99, 50, [
  //     "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //     "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-40.webp",
  //   ]),
  //   new Product(
  //     8,
  //     "Skirt",
  //     "Clothes",
  //     19.99,
  //     40,
  //     [
  //       "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-40.webp",
  //       "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //     ],
  //     { isFeatured: true }
  //   ),
  //   new Product(
  //     9,
  //     "Morbi",
  //     "Shoes",
  //     19.99,
  //     40,
  //     [
  //       "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  //     ],
  //     { isFeatured: true }
  //   ),
  // ];

  const defaultProducts = [
    new Product(
      1,
      "Cotton T-Shirt",
      "Shirts",
      19.99,
      50,
      [
        "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/01/product-image-15-600x600.webp",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "Comfortable cotton t-shirt for daily wear.",
        discount: 0.25,
        isFeatured: true,
        brand: "BasicWear",
        colors: ["White", "Black"],
        sizes: ["S", "M", "L"],
      }
    ),
    new Product(
      2,
      "Wool Sweater",
      "Sweaters",
      49.99,
      25,
      [
        "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "Warm and stylish wool sweater.",
        discount: 0.2,
        isFeatured: true,
        brand: "CozyKnit",
        colors: ["Gray", "Navy"],
        sizes: ["M", "L", "XL"],
      }
    ),
    new Product(
      3,
      "White Sneakers",
      "Shoes",
      59.99,
      30,
      [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "Trendy white sneakers for casual outfits.",
        isFeatured: true,
        brand: "StepUp",
        colors: ["White"],
        sizes: ["38", "39", "40", "41"],
      }
    ),
    new Product(
      4,
      "Denim Jacket",
      "Jackets",
      69.99,
      20,
      [
        "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-34-600x600.webp",
        "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "Classic denim jacket for all seasons.",
        discount: 0.15,
        isFeatured: true,
        brand: "UrbanWear",
        colors: ["Blue"],
        sizes: ["M", "L", "XL"],
      }
    ),
    new Product(
      5,
      "Black Slim Jeans",
      "Jeans",
      39.99,
      40,
      [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "Slim-fit black jeans for a modern look.",
        isFeatured: true,
        brand: "TrendyFit",
        colors: ["Black"],
        sizes: ["30", "32", "34"],
      }
    ),

    new Product(
      8,
      "Floral Skirt",
      "Skirts",
      24.99,
      35,
      [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/02/product-image-40.webp",
      ],
      {
        description: "Chic floral skirt for summer outings.",
        isFeatured: true,
        brand: "SummerVibe",
        colors: ["Multicolor"],
        sizes: ["S", "M", "L"],
      }
    ),
    new Product(
      9,
      "Running Shoes",
      "Shoes",
      69.99,
      25,
      [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "High-performance running shoes for athletes.",
        brand: "SpeedStep",
        colors: ["Black", "Red"],
        sizes: ["39", "40", "41", "42"],
      }
    ),

    new Product(
      14,
      "Hiking Boots",
      "Shoes",
      89.99,
      15,
      [
        "https://startersites.io/blocksy/kiddy/wp-content/uploads/2025/01/product-image-21-600x600.webp",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "Durable hiking boots for outdoor adventures.",
        brand: "TrailBlazer",
        colors: ["Brown", "Black"],
        sizes: ["40", "41", "42"],
      }
    ),

    new Product(
      16,
      "Canvas Sneakers",
      "Shoes",
      49.99,
      25,
      [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      {
        description: "Casual canvas sneakers for everyday wear.",
        brand: "EasyStep",
        colors: ["White", "Blue"],
        sizes: ["38", "39", "40"],
      }
    ),
  ];
  if (!StorageManager.load("products")) {
    StorageManager.save("products", defaultProducts);
  }
}

initializeDefaultProducts();
