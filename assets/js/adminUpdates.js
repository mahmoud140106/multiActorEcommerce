import { StorageManager } from "./storageManager.js";
import { MessageManager } from "./messageManager.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = StorageManager.load("currentUser");
  if (!currentUser || currentUser.role !== "admin") {
    showToast("You must be logged in as an Admin to view updates.", "error");
    window.location.href = "/index.html";
    return;
  }

  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("href").includes("updates.html")) {
      link.classList.add("active");
    }
  });

  function populateSenderFilter() {
    const senderFilter = document.getElementById("senderFilter");
    const users = StorageManager.load("users") || [];
    const senders = new Set();
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    messages.forEach(message => {
      const otherUserId = message.senderId === currentUser.id ? message.recipientId : message.senderId;
      senders.add(otherUserId);
    });

    senders.forEach(senderId => {
      const sender = users.find(u => u.id === senderId);
      if (sender) {
        const option = document.createElement("option");
        option.value = senderId;
        option.textContent = `${sender.userName} (${sender.role})`;
        senderFilter.appendChild(option);
      }
    });
  }

  function loadMessages(filterSenderId = "") {
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    const messagesList = document.getElementById("messagesList");
    messagesList.innerHTML = "";

    if (messages.length === 0) {
      messagesList.innerHTML = '<p class="text-muted">No messages available.</p>';
      return;
    }

    const users = StorageManager.load("users") || [];
    const groupedMessages = {};

    messages.forEach(message => {
      const otherUserId = message.senderId === currentUser.id ? message.recipientId : message.senderId;
      if (!groupedMessages[otherUserId]) {
        groupedMessages[otherUserId] = [];
      }
      groupedMessages[otherUserId].push(message);
    });

    const conversations = Object.entries(groupedMessages).map(([otherUserId, userMessages]) => ({
      otherUserId: parseInt(otherUserId),
      messages: userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      latestTimestamp: userMessages.reduce((latest, msg) => {
        const msgDate = new Date(msg.timestamp);
        return latest > msgDate ? latest : msgDate;
      }, new Date(userMessages[0].timestamp))
    })).sort((a, b) => b.latestTimestamp - a.latestTimestamp);

    conversations.forEach(conversation => {
      if (filterSenderId && conversation.otherUserId !== parseInt(filterSenderId)) {
        return;
      }

      const otherUser = users.find(u => u.id === conversation.otherUserId);
      const card = document.createElement("div");
      card.className = `card message-card mb-2 p-3`;
      card.dataset.otherUserId = conversation.otherUserId;
      let messagesHTML = "";
      conversation.messages.forEach(message => {
        const isSent = message.senderId === currentUser.id;
        messagesHTML += `
          <div class="message-item ${isSent ? "sent" : "received"}">
            <p class="mb-1">${message.content}</p>
            <small class="text-muted">${new Date(message.timestamp).toLocaleString()}</small>
          </div>
        `;
      });

      card.innerHTML = `
        <p class="mb-1"><strong>Conversation with:</strong> ${otherUser ? otherUser.userName : "Unknown"} (${otherUser ? otherUser.role : "unknown"})</p>
        ${messagesHTML}
        <i class="fas fa-reply reply-icon mt-2" title="Reply"></i>
        <div class="reply-form" id="reply-form-${conversation.otherUserId}">
          <textarea class="form-control mt-2 reply-textarea" rows="2" placeholder="Type your reply..."></textarea>
          <button class="btn btn-sm btn-success mt-2 send-reply-btn">Send Reply</button>
          <button class="btn btn-sm btn-secondary mt-2 cancel-reply-btn">Cancel</button>
        </div>
      `;

      const replyIcon = card.querySelector(".reply-icon");
      const replyForm = card.querySelector(`#reply-form-${conversation.otherUserId}`);
      const sendReplyBtn = card.querySelector(".send-reply-btn");
      const cancelReplyBtn = card.querySelector(".cancel-reply-btn");
      const replyTextarea = card.querySelector(".reply-textarea");

      replyIcon.addEventListener("click", () => {
        replyForm.classList.toggle("show");
      });

      sendReplyBtn.addEventListener("click", () => {
        const content = replyTextarea.value.trim();
        if (!content) {
          showToast("Reply cannot be empty.", "error");
          return;
        }
        MessageManager.sendMessage(currentUser.id, conversation.otherUserId, content);
        showToast("Reply sent successfully!", "success");
        replyForm.classList.remove("show");
        replyTextarea.value = "";
        loadMessages(filterSenderId);
      });

      cancelReplyBtn.addEventListener("click", () => {
        replyForm.classList.remove("show");
        replyTextarea.value = "";
      });

      messagesList.appendChild(card);
    });
  }

  const senderFilter = document.getElementById("senderFilter");
  senderFilter.addEventListener("change", (e) => {
    loadMessages(e.target.value);
  });

  populateSenderFilter();
  loadMessages();
});