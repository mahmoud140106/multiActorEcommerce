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
      reply: null
    });
    StorageManager.save("messages", messages);
  }

  static sendReply(senderId, recipientId, subject, type, reply) {
    const messages = StorageManager.load("messages") || [];
    const message = messages.find(
      m =>
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
      m =>
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
    return messages.filter(m => m.recipientId === userId || m.senderId === userId);
  }

  static markMessageAsRead(messageId) {
    const messages = StorageManager.load("messages") || [];
    const message = messages.find(m => m.id === messageId);
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

export { MessageManager };