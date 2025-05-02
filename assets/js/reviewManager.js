import { StorageManager } from "./storageManager.js";
import { ProductManager } from "./productManager.js";

export class Review {
  constructor(id, productId, userId, rating, comment, createdAt = new Date()) {
    this.id = id;
    this.productId = productId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

export class ReviewManager {
  static addReview(productId, userId, rating, comment) {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars.");
    }

    const id = Date.now();
    const review = new Review(id, productId, userId, rating, comment);
    let reviews = StorageManager.load("reviews") || [];
    reviews.push(review);
    StorageManager.save("reviews", reviews);

    // Update product's rating and numReviews
    this.updateProductRating(productId);
    return review;
  }

  static getReviewsByProduct(productId) {
    const reviews = StorageManager.load("reviews") || [];
    return reviews.filter((review) => review.productId === productId);
  }

  static deleteReview(id) {
    let reviews = StorageManager.load("reviews") || [];
    const review = reviews.find((r) => r.id === id);
    if (!review) return;

    reviews = reviews.filter((r) => r.id !== id);
    StorageManager.save("reviews", reviews);

    // Update product's rating after deletion
    this.updateProductRating(review.productId);
  }

  static updateProductRating(productId) {
    const reviews = this.getReviewsByProduct(productId);
    const product = ProductManager.getProduct(productId);
    if (!product) return;

    const numReviews = reviews.length;
    const averageRating =
      numReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews
        : 0;

    // Update product with new rating and numReviews
    ProductManager.updateProduct(
      product.id,
      product.name,
      product.categoryId,
      product.price,
      product.stock,
      product.images,
      product.sellerId,
      {
        description: product.description,
        discount: product.discount,
        isFeatured: product.isFeatured,
        brand: product.brand,
        colors: product.colors,
        sizes: product.sizes,
        createdAt: product.createdAt,
        updatedAt: new Date(),
        isActive: product.isActive,
        sku: product.sku,
        rating: averageRating,
        numReviews: numReviews,
        soldCount: product.soldCount,
      }
    );
  }

  static getAllReviews() {
    return StorageManager.load("reviews") || [];
  }
}

export function initializeDefaultReviews() {
  const defaultReviews = [
    new Review(
      Date.now() + 1,
      1, // Product from Dina's order
      5, // Dina Mostafa
      4,
      "The t-shirt is great quality and fits perfectly. Shipping was a bit slow, but overall I'm satisfied.",
      new Date("2025-01-17T10:00:00Z")
    ),
    new Review(
      Date.now() + 2,
      2, // Product from Dina's order
      5, // Dina Mostafa
      5,
      "Absolutely love this jacket! The gray color is stylish, and it’s super comfortable. Highly recommend!",
      new Date("2025-01-18T12:00:00Z")
    ),
    new Review(
      Date.now() + 3,
      4, // Product from Ibrahim's order
      6, // Ibrahim Shaban
      3,
      "The shirt is decent, but the blue color looks slightly different from the website. It’s okay for the price.",
      new Date("2025-02-12T09:00:00Z")
    ),
    new Review(
      Date.now() + 4,
      5, // Product from Ibrahim's order
      6, // Ibrahim Shaban
      5,
      "These pants are fantastic! Really durable and comfortable. Will definitely buy more.",
      new Date("2025-02-13T11:00:00Z")
    ),
    new Review(
      Date.now() + 5,
      6, // Product from Taha's order
      7, // Taha Hassan
      4,
      "The hoodie is warm and looks great. Only downside is it took a week to arrive, but worth it.",
      new Date("2025-12-28T14:00:00Z")
    ),
    new Review(
      Date.now() + 6,
      7, // Product from Khaled's order
      9, // Khaled Samir
      2,
      "The shirt’s material feels a bit cheap for the price. Expected better quality. Color is nice though.",
      new Date("2025-05-22T15:00:00Z")
    ),
    new Review(
      Date.now() + 7,
      8, // Product from Khaled's order
      9, // Khaled Samir
      4,
      "Pretty good socks, very comfortable. No complaints here, would buy again.",
      new Date("2025-05-23T10:00:00Z")
    ),
    new Review(
      Date.now() + 8,
      9, // Product from Nour's order
      10, // Nour Ehab
      1,
      "Really disappointed with this cap. It arrived damaged, and I had to cancel the order. Poor quality control.",
      new Date("2025-06-12T11:00:00Z")
    ),
    new Review(
      Date.now() + 9,
      10, // Product from Laila's order
      12, // Laila Rami
      5,
      "This dress is stunning! The pink color pops, and it fits like a dream. Got so many compliments!",
      new Date("2025-08-14T08:00:00Z")
    ),
    new Review(
      Date.now() + 10,
      11, // Product from Laila's order
      12, // Laila Rami
      3,
      "The shoes are okay, but they’re a bit tight. Might need to exchange for a larger size.",
      new Date("2025-08-15T09:00:00Z")
    ),
    new Review(
      Date.now() + 11,
      12, // Product from Amr's order
      13, // Amr Zaki
      5,
      "Best sneakers I’ve ever bought! Super comfy and stylish. Delivered on time too.",
      new Date("2025-09-22T16:00:00Z")
    ),
  ];

  const existingReviews = StorageManager.load("reviews") || [];
  if (existingReviews.length === 0) {
    StorageManager.save("reviews", defaultReviews);

    const productIds = [
      ...new Set(defaultReviews.map((review) => review.productId)),
    ];
    productIds.forEach((productId) =>
      ReviewManager.updateProductRating(productId)
    );
  }

  return defaultReviews;
}

initializeDefaultReviews();
