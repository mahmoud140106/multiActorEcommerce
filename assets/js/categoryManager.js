import { StorageManager } from "./storageManager.js";

export class Category {
  constructor(id, name, image) {
    this.id = id;
    this.name = name;
    this.image = image;
  }
}

export class CategoryManager {
  static createCategory(id, name, image) {
    const category = new Category(id, name, image);
    let categories = StorageManager.load("categories") || [];
    categories.push(category);
    StorageManager.save("categories", categories);
  }

  static getCategory(id) {
    const categories = StorageManager.load("categories") || [];
    return categories.find((category) => category.id === id);
  }

  static getAllCategories() {
    return StorageManager.load("categories") || [];
  }

  static updateCategory(id, name, image) {
    let categories = StorageManager.load("categories") || [];
    categories = categories.map((category) =>
      category.id === id ? new Category(id, name, image) : category
    );
    StorageManager.save("categories", categories);
  }

  static deleteCategory(id) {
    let categories = StorageManager.load("categories") || [];
    categories = categories.filter((category) => category.id !== id);
    StorageManager.save("categories", categories);
  }
}

// Initialize default categories
export function initializeDefaultCategories() {
  const defaultCategories = [
    new Category(1, "Shirts", "https://example.com/shirts.jpg"),
    new Category(2, "Pants", "https://example.com/pants.jpg"),
    new Category(3, "Jackets", "https://example.com/jackets.jpg"),
    new Category(4, "Skirts", "https://example.com/skirts.jpg"),
    new Category(5, "Shoes", "https://example.com/shoes.jpg"),
    new Category(6, "Sweaters", "https://example.com/sweaters.jpg"),
  ];

  if (!StorageManager.load("categories")) {
    StorageManager.save("categories", defaultCategories);
    console.log("initializeDefaultCategories: Default categories initialized");
  }
}

initializeDefaultCategories();
