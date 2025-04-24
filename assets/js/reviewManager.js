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
      1,
      2,
      4,
      "Really great product, very happy with the quality!",
      new Date()
    ),
    new Review(
      Date.now() + 2,
      1,
      3,
      5,
      "Amazing purchase, totally exceeded my expectations!",
      new Date()
    ),
    new Review(
      Date.now() + 3,
      2,
      4,
      3,
      "Decent product, but the delivery took too long.",
      new Date()
    ),
    new Review(
      Date.now() + 4,
      2,
      5,
      4,
      "This product is absolutely fantastic! The quality is top-notch, and it performs exactly as advertised. My only minor complaint is that the packaging could have been a bit more secure, but overall, I'm extremely satisfied with this purchase and would highly recommend it to others!",
      new Date()
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
