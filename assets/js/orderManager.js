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
    constructor(id, customerId, items, total, status = "pending", createdAt = new Date()) {
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
            const product = ProductManager.getProduct(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found.`);
            if (product.stock < item.quantity) throw new Error(`Insufficient stock for product ${product.name}.`);

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
                item.productId,
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
            order.items.some((item) => item.getSellerId() === sellerId)
        );
    }

    static getAllOrders() {
        return StorageManager.load("orders") || [];
    }

    static updateOrderStatus(orderId, status) {
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status.");
        }

        let orders = StorageManager.load("orders") || [];
        orders = orders.map((order) =>
            order.id === orderId
                ? { ...order, status, updatedAt: new Date() }
                : order
        );
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

// Initialize default orders (for testing)
function initializeDefaultOrders() {
    const defaultOrders = [
        new Order(
            1,
            5, 
            [
                new OrderItem(1, 2, "M", "White", 14.99), 
                new OrderItem(2, 1, "L", "Gray", 39.99), 
            ],
            54.97, // 2 * 14.99 + 39.99
            "pending"
        ),
        new Order(
            2,
            5,
            [
                new OrderItem(3, 1, "40", "White", 59.99),
            ],
            59.99,
            "shipped"
        ),
    ];

    if (!StorageManager.load("orders")) {
        StorageManager.save("orders", defaultOrders);
        console.log("initializeDefaultOrders: Default orders initialized");
    }
}

initializeDefaultOrders();