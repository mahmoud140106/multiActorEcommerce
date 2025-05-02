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
    new Category(1, "COAT", "https://mensclubcollection.com/cdn/shop/files/R6A5512_1024x1024.jpg?v=1744805191" ),
    new Category(2, "BLAZER", "https://mensclubcollection.com/cdn/shop/files/R6A5402_be820f66-61e2-4265-be0d-d839feafa8bf_1024x1024.jpg?v=1744804914"),
    new Category(3, "ALL DENIM", "https://mensclubcollection.com/cdn/shop/files/R6A7424_1024x1024.jpg?v=1745338796"),
    new Category(4, "SHIRTS", "https://mensclubcollection.com/cdn/shop/files/0E9A5090copy_1024x1024.jpg?v=1745338897"),
    new Category(5, "JACKET", "https://mensclubcollection.com/cdn/shop/files/UntitledSession20403copy_1024x1024.jpg?v=1745338851"),
    new Category(6, "SWEAT SHIRT", "https://mensclubcollection.com/cdn/shop/files/Untitled_Session20653_copy._234610f2-9566-415f-895a-1b196eb202ad.jpg?v=1745338571&width=1066"),
    new Category(7, "HOODIE", "https://mensclubcollection.com/cdn/shop/files/0E9A6303_1024x1024.jpg?v=1745339197"),
    new Category(8, "CASUAL VEST", "https://mensclubcollection.com/cdn/shop/files/DSC07258.jpg?v=1745338765&width=1066"),
    new Category(9, "CASUAL VEST", "https://mensclubcollection.com/cdn/shop/files/DSC07258.jpg?v=1745338765&width=1066"),
  ];

  if (!StorageManager.load("categories")) {
    StorageManager.save("categories", defaultCategories);
    console.log("initializeDefaultCategories: Default categories initialized");
  }
}

initializeDefaultCategories();
