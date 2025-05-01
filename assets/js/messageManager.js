import { StorageManager } from "./storageManager.js";

class MessageManager {
  static sendMessage(senderId, recipientId, content) {
    const messages = StorageManager.load("messages") || [];
    messages.push({
      id: messages.length + 1,
      senderId,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    });
    StorageManager.save("messages", messages);
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