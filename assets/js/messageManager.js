import { StorageManager } from "./storageManager.js";

class MessageManager {
  static sendMessage(senderId, recipientId, subject, type, content) {
    const messages = StorageManager.load("messages") || [];
    messages.push({
      id: messages.length + 1,
      senderId,
      recipientId,
      subject: subject || "No Subject",
      type: type || "General",
      content,
      timestamp: new Date().toISOString(),
      status: "Open",
      read: false,
      reply: null,
    });
    StorageManager.save("messages", messages);
  }

  static sendReply(senderId, recipientId, subject, type, reply) {
    const messages = StorageManager.load("messages") || [];
    const message = messages.find(
      (m) =>
        m.senderId === recipientId &&
        m.recipientId === senderId &&
        m.subject === subject &&
        m.type === type
    );
    if (message) {
      message.reply = reply;
      message.status = "Responded";
      StorageManager.save("messages", messages);
    }
  }

  static updateMessageStatus(senderId, recipientId, subject, type, status) {
    const messages = StorageManager.load("messages") || [];
    const message = messages.find(
      (m) =>
        m.senderId === senderId &&
        m.recipientId === recipientId &&
        m.subject === subject &&
        m.type === type
    );
    if (message) {
      message.status = status;
      StorageManager.save("messages", messages);
    }
  }

  static getMessagesForUser(userId) {
    const messages = StorageManager.load("messages") || [];
    return messages.filter(
      (m) => m.recipientId === userId || m.senderId === userId
    );
  }

  static markMessageAsRead(messageId) {
    const messages = StorageManager.load("messages") || [];
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      message.read = true;
      StorageManager.save("messages", messages);
    }
  }
}

// class SystemUpdateManager {
//   static getSystemUpdates() {
//     return StorageManager.load("systemUpdates") || [];
//   }

//   static addSystemUpdate(message) {
//     const updates = StorageManager.load("systemUpdates") || [];
//     updates.push({
//       id: updates.length + 1,
//       message,
//       timestamp: new Date().toISOString()
//     });
//     StorageManager.save("systemUpdates", updates);
//   }
// }

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  const navLinks = document.querySelectorAll(".sidebar .nav-link");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (currentPath.includes(linkPath) && linkPath !== "#") {
      link.classList.add("active");
    } else if (currentPath === "/" && linkPath.includes("index.html")) {
      link.classList.add("active");
    }
  });
});

function initializeDefaultMessages() {
  const defaultMessages = [
    {
      id: 1,
      senderId: 5,
      recipientId: 1,
      subject: "Order Status Inquiry",
      type: "Order",
      content:
        "Hello, can you please provide an update on my order #12345? It was supposed to arrive last week.",
      timestamp: new Date("2025-01-16T10:00:00Z").toISOString(),
      status: "Open",
      read: false,
      reply: null,
    },
    {
      id: 2,
      senderId: 1,
      recipientId: 5,
      subject: "Order Status Inquiry",
      type: "Order",
      content:
        "Hi Dina, thank you for reaching out. Your order #12345 is currently being processed and will ship by tomorrow. You'll receive a tracking number soon.",
      timestamp: new Date("2025-01-16T12:00:00Z").toISOString(),
      status: "Responded",
      read: true,
      reply: null,
    },
    {
      id: 3,
      senderId: 2,
      recipientId: 1,
      subject: "Product Listing Issue",
      type: "Support",
      content:
        "Hi Admin, my new product listing (ID: P789) isn't appearing on the platform. Can you check what's wrong?",
      timestamp: new Date("2025-01-11T09:30:00Z").toISOString(),
      status: "Open",
      read: false,
      reply: null,
    },
    {
      id: 4,
      senderId: 1,
      recipientId: 2,
      subject: "Product Listing Issue",
      type: "Support",
      content:
        "Hello Mahmoud, the listing was flagged for missing images. Please upload the required images, and we’ll approve it within 24 hours.",
      timestamp: new Date("2025-01-11T11:00:00Z").toISOString(),
      status: "Responded",
      read: true,
      reply: null,
    },
    {
      id: 5,
      senderId: 6,
      recipientId: 1,
      subject: "Refund Request",
      type: "Order",
      content:
        "Dear Admin, I received a damaged item (Order #67890). Can I get a refund or replacement?",
      timestamp: new Date("2025-02-11T14:00:00Z").toISOString(),
      status: "Open",
      read: false,
      reply: null,
    },
    {
      id: 6,
      senderId: 4,
      recipientId: 1,
      subject: "Payment Delay",
      type: "Payment",
      content:
        "Hi, I haven’t received payment for my sales from last week. Can you confirm when it will be processed?",
      timestamp: new Date("2025-03-31T08:00:00Z").toISOString(),
      status: "Open",
      read: false,
      reply: null,
    },
    {
      id: 7,
      senderId: 1,
      recipientId: 4,
      subject: "Payment Delay",
      type: "Payment",
      content:
        "Hi Farah, apologies for the delay. The payment has been processed and should reflect in your account by end of day.",
      timestamp: new Date("2025-03-31T10:00:00Z").toISOString(),
      status: "Responded",
      read: false,
      reply: null,
    },
    {
      id: 8,
      senderId: 7,
      recipientId: 1,
      subject: "Product Availability",
      type: "General",
      content:
        "Hello, is the item (SKU: ABC123) available in blue? I can only see red on the website.",
      timestamp: new Date("2025-12-27T16:00:00Z").toISOString(),
      status: "Open",
      read: false,
      reply: null,
    },
  ];

  if (!StorageManager.load("messages")) {
    StorageManager.save("messages", defaultMessages);
    console.log("initializeDefaultMessages: Default messages initialized");
  }
}

initializeDefaultMessages();
export { MessageManager };
