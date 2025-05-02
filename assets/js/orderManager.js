import { StorageManager } from "./storageManager.js";
import { ProductManager } from "./productManager.js";
import { UserManager } from "./userManager.js";

export class OrderItem {
  constructor(productId, quantity, size, color, priceAtPurchase) {
    this.productId = productId;
    this.quantity = quantity;
    this.size = size;
    this.color = color;
    this.priceAtPurchase = priceAtPurchase;
  }

  getProduct() {
    return ProductManager.getProduct(this.productId);
  }

  getSellerId() {
    const product = this.getProduct();
    return product ? product.sellerId : null;
  }
}

export class Order {
  constructor(
    id,
    customerId,
    items,
    total,
    status = "pending",
    createdAt = new Date()
  ) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.total = total;
    this.status = status; // pending, processing, shipped, delivered, cancelled
    this.createdAt = createdAt;
  }
}

export class OrderManager {
  static createOrder(customerId, items) {
    // Validate customer
    const customer = UserManager.getUser(customerId);
    if (!customer || customer.role !== "customer") {
      throw new Error("Invalid customer.");
    }

    let total = 0;
    const validatedItems = items.map((item) => {
      const product = item.id ? ProductManager.getProduct(item.id) : item;
      console.log(product);
      if (!product) throw new Error(`Product ${item.id} not found.`);
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for product ${product.name}.`);

      const price = product.isOnSale ? product.discountedPrice : product.price;
      total += price * item.quantity;

      // Update product stock
      ProductManager.updateProduct(
        product.id,
        product.name,
        product.categoryId,
        product.price,
        product.stock - item.quantity,
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
          rating: product.rating,
          numReviews: product.numReviews,
          soldCount: product.soldCount + item.quantity,
        }
      );

      return new OrderItem(
        product.id,
        item.quantity,
        item.size,
        item.color,
        price
      );
    });

    const id = Date.now();
    const order = new Order(id, customerId, validatedItems, total);
    let orders = StorageManager.load("orders") || [];
    orders.push(order);
    StorageManager.save("orders", orders);

    return order;
  }

  static getOrder(id) {
    const orders = StorageManager.load("orders") || [];
    return orders.find((order) => order.id === id);
  }

  static getOrdersByCustomer(customerId) {
    const orders = StorageManager.load("orders") || [];
    return orders.filter((order) => order.customerId === customerId);
  }

  static getOrdersBySeller(sellerId) {
    const orders = StorageManager.load("orders") || [];
    return orders.filter((order) =>
      order.items.some((item) => item.sellerId === sellerId)
    );
  }

  static getAllOrders() {
    return StorageManager.load("orders") || [];
  }

  static updateOrderStatus(orderId, status) {
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status.");
    }

    let orders = StorageManager.load("orders") || [];
    let order = orders.find((order) => order.id == orderId);
    order.status = status;
    // orders = orders.map((order) =>
    //   order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
    // );
    StorageManager.save("orders", orders);
  }

  static cancelOrder(orderId) {
    const order = this.getOrder(orderId);
    if (!order) throw new Error("Order not found.");

    // Restore stock for cancelled order
    order.items.forEach((item) => {
      const product = ProductManager.getProduct(item.productId);
      if (product) {
        ProductManager.updateProduct(
          product.id,
          product.name,
          product.categoryId,
          product.price,
          product.stock + item.quantity,
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
            rating: product.rating,
            numReviews: product.numReviews,
            soldCount: product.soldCount - item.quantity,
          }
        );
      }
    });

    this.updateOrderStatus(orderId, "cancelled");
  }
}

function initializeDefaultOrders() {
  const defaultOrders = [
    new Order(
      1,
      5, // Dina Mostafa
      [
        new OrderItem(1, 2, "M", "White", 14.99),
        new OrderItem(2, 1, "L", "Gray", 39.99),
      ],
      54.97, // 2 * 14.99 + 39.99
      "pending",
      new Date("2025-01-16T10:00:00Z")
    ),
    new Order(
      2,
      5, // Dina Mostafa
      [new OrderItem(3, 1, "40", "White", 59.99)],
      59.99,
      "shipped",
      new Date("2025-01-20T14:00:00Z")
    ),
    new Order(
      3,
      6, // Ibrahim Shaban
      [
        new OrderItem(4, 1, "S", "Blue", 29.99),
        new OrderItem(5, 3, "M", "Black", 19.99),
      ],
      89.96, // 29.99 + 3 * 19.99
      "pending",
      new Date("2025-02-11T09:00:00Z")
    ),
    new Order(
      4,
      7, // Taha Hassan
      [new OrderItem(6, 2, "XL", "Red", 49.99)],
      99.98, // 2 * 49.99
      "delivered",
      new Date("2025-12-27T12:00:00Z")
    ),
    new Order(
      5,
      9, // Khaled Samir
      [
        new OrderItem(7, 1, "L", "Green", 34.99),
        new OrderItem(8, 1, "M", "White", 24.99),
      ],
      59.98, // 34.99 + 24.99
      "pending",
      new Date("2025-05-21T15:00:00Z")
    ),
    new Order(
      6,
      10, // Nour Ehab
      [new OrderItem(9, 2, "S", "Yellow", 15.99)],
      31.98, // 2 * 15.99
      "delivered",
      new Date("2025-06-11T11:00:00Z")
    ),
    new Order(
      7,
      12, // Laila Rami
      [
        new OrderItem(10, 1, "M", "Pink", 44.99),
        new OrderItem(11, 2, "L", "Blue", 27.99),
      ],
      100.97, // 44.99 + 2 * 27.99
      "pending",
      new Date("2025-08-13T08:00:00Z")
    ),
    new Order(
      8,
      13, // Amr Zaki
      [new OrderItem(12, 1, "42", "Black", 79.99)],
      79.99,
      "delivered",
      new Date("2025-09-21T16:00:00Z")
    ),
  ];

  if (!StorageManager.load("orders")) {
    StorageManager.save("orders", defaultOrders);
    console.log("initializeDefaultOrders: Default orders initialized");
  }
}

initializeDefaultOrders();
