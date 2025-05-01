import { ProductManager } from "./productManager.js";
import { StorageManager } from "./storageManager.js";
import { MessageManager } from "./messageManager.js";
import { ReviewManager } from "./reviewManager.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Seller Updates page loaded.");

  const currentUser = StorageManager.load("currentUser");
  if (!currentUser || currentUser.role !== "seller") {
    showToast("You must be logged in as a Seller to view updates.", "error");
    window.location.href = "/index.html";
    return;
  }
  console.log("Current user:", currentUser);

  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  navLinks.forEach((link) => {
    if (link.getAttribute("href").includes("updates.html")) {
      link.classList.add("active");
    }
  });

  function loadNotifications() {
    try {
      const notificationsList = document.getElementById("notificationsList");
      if (!notificationsList) {
        console.error("notificationsList element not found in DOM.");
        return;
      }
      notificationsList.innerHTML = "";

      const notifications =
        ProductManager.getNotificationsForSeller(currentUser.id).slice(0, 5) || [];
      console.log("Notifications fetched:", notifications);

      if (!Array.isArray(notifications) || notifications.length === 0) {
        notificationsList.innerHTML =
          '<p class="text-muted">There are no notifications yet.</p>';
        return;
      }

      notifications.forEach((notification) => {
        const statusClass = notification.message.includes("accepted")
          ? "accepted"
          : notification.message.includes("rejected")
          ? "rejected"
          : "";
        const card = document.createElement("div");
        card.className = `card notification-card ${statusClass} mb-2 p-3`;
        card.innerHTML = `
          <p class="mb-1">${notification.message}</p>
          <small class="text-muted">${new Date(
            notification.createdAt
          ).toLocaleString()}</small>
        `;
        notificationsList.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading notifications:", error);
      const notificationsList = document.getElementById("notificationsList");
      if (notificationsList) {
        notificationsList.innerHTML =
          '<p class="text-muted">There are no notifications yet.</p>';
      }
    }
  }

  function populateProductFilter() {
    const productFilter = document.getElementById("productFilter");
    if (!productFilter) {
      console.error("productFilter element not found in DOM.");
      return;
    }
    const products =
      ProductManager.getProductsBySeller(currentUser.id).filter(
        (product) => product.status === "accepted"
      ) || [];
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = product.name;
      productFilter.appendChild(option);
    });
  }

  function loadReviews(filterProductId = "") {
    try {
      const reviewsList = document.getElementById("reviewsList");
      if (!reviewsList) {
        console.error("reviewsList element not found in DOM.");
        return;
      }
      reviewsList.innerHTML = "";

      const products =
        ProductManager.getProductsBySeller(currentUser.id).filter(
          (product) => product.status === "accepted"
        ) || [];
      console.log("Products fetched for seller:", products);

      let allReviews = [];
      products.forEach((product) => {
        if (filterProductId && product.id !== parseInt(filterProductId)) {
          return;
        }
        const reviews = ReviewManager.getReviewsByProduct(product.id) || [];
        console.log(`Reviews for product ${product.id}:`, reviews);
        reviews.forEach((review) => {
          allReviews.push({ product, review });
        });
      });

      if (!Array.isArray(allReviews) || allReviews.length === 0) {
        reviewsList.innerHTML =
          '<p class="text-muted">There are no reviews yet.</p>';
        return;
      }

      allReviews.forEach(({ product, review }) => {
        const card = document.createElement("div");
        card.className = "card review-card mb-2 p-3";
        card.innerHTML = `
          <p class="mb-1"><strong>Product:</strong> ${product.name}</p>
          <p class="mb-1"><strong>Rating:</strong> ${"★".repeat(
            review.rating
          )}${"☆".repeat(5 - review.rating)}</p>
          <p class="mb-1"><strong>Comment:</strong> ${
            review.comment || "No comment"
          }</p>
          <small class="text-muted">${new Date(
            review.createdAt
          ).toLocaleString()}</small>
        `;
        reviewsList.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading reviews:", error);
      const reviewsList = document.getElementById("reviewsList");
      if (reviewsList) {
        reviewsList.innerHTML =
          '<p class="text-muted">There are no reviews yet.</p>';
      }
    }
  }

  function populateSenderFilter() {
    const senderFilter = document.getElementById("senderFilter");
    if (!senderFilter) {
      console.error("senderFilter element not found in DOM.");
      return;
    }
    const users = StorageManager.load("users") || [];
    const senders = new Set();
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    messages.forEach((message) => {
      const otherUserId =
        message.senderId === currentUser.id
          ? message.recipientId
          : message.senderId;
      senders.add(otherUserId);
    });

    senders.forEach((senderId) => {
      const sender = users.find((u) => u.id === senderId);
      if (sender) {
        const option = document.createElement("option");
        option.value = senderId;
        option.textContent = `${sender.userName} (${sender.role})`;
        senderFilter.appendChild(option);
      }
    });
  }

  function loadMessages(filterSenderId = "") {
    try {
      const messagesList = document.getElementById("messagesList");
      if (!messagesList) {
        console.error("messagesList element not found in DOM.");
        return;
      }
      messagesList.innerHTML = "";

      const messages = MessageManager.getMessagesForUser(currentUser.id);
      console.log("Messages fetched:", messages);

      if (!Array.isArray(messages) || messages.length === 0) {
        messagesList.innerHTML =
          '<p class="text-muted">No messages available.</p>';
        return;
      }

      const users = StorageManager.load("users") || [];
      const groupedMessages = {};

      messages.forEach((message) => {
        const otherUserId =
          message.senderId === currentUser.id
            ? message.recipientId
            : message.senderId;
        if (!groupedMessages[otherUserId]) {
          groupedMessages[otherUserId] = [];
        }
        groupedMessages[otherUserId].push(message);
      });

      const conversations = Object.entries(groupedMessages)
        .map(([otherUserId, userMessages]) => {
          const latestTimestamp = userMessages.reduce((latest, msg) => {
            const msgDate = new Date(msg.timestamp);
            if (isNaN(msgDate.getTime())) {
              console.error("Invalid timestamp in message:", msg);
              return latest;
            }
            return latest > msgDate ? latest : msgDate;
          }, new Date(userMessages[0].timestamp));

          if (isNaN(latestTimestamp.getTime())) {
            console.error(
              "Invalid latestTimestamp for conversation with user:",
              otherUserId
            );
            return null;
          }

          return {
            otherUserId: parseInt(otherUserId),
            messages: userMessages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ),
            latestTimestamp,
          };
        })
        .filter((conversation) => conversation !== null)
        .sort((a, b) => b.latestTimestamp - a.latestTimestamp);

      conversations.forEach((conversation) => {
        if (
          filterSenderId &&
          conversation.otherUserId !== parseInt(filterSenderId)
        ) {
          return;
        }

        const otherUser = users.find((u) => u.id === conversation.otherUserId);
        const card = document.createElement("div");
        card.className = `card message-card mb-2 p-3`;
        card.dataset.otherUserId = conversation.otherUserId;
        let messagesHTML = "";
        conversation.messages.forEach((message) => {
          const isSent = message.senderId === currentUser.id;
          messagesHTML += `
            <div class="message-item ${isSent ? "sent" : "received"}">
              <p class="mb-1">${message.content}</p>
              <small class="text-muted">${new Date(
                message.timestamp
              ).toLocaleString()}</small>
            </div>
          `;
        });

        card.innerHTML = `
          <p class="mb-1"><strong>Conversation with:</strong> ${
            otherUser ? otherUser.userName : "Unknown"
          } (${otherUser ? otherUser.role : "unknown"})</p>
          ${messagesHTML}
          <i class="fas fa-reply reply-icon mt-2" title="Reply"></i>
          <div class="reply-form" id="reply-form-${conversation.otherUserId}">
            <textarea class="form-control mt-2 reply-textarea" rows="2" placeholder="Type your reply..."></textarea>
            <button class="btn btn-sm btn-success mt-2 send-reply-btn">Send Reply</button>
            <button class="btn btn-sm btn-secondary mt-2 cancel-reply-btn">Cancel</button>
          </div>
        `;

        const replyIcon = card.querySelector(".reply-icon");
        const replyForm = card.querySelector(
          `#reply-form-${conversation.otherUserId}`
        );
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
          MessageManager.sendMessage(
            currentUser.id,
            conversation.otherUserId,
            content
          );
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
    } catch (error) {
      console.error("Error loading messages:", error);
      const messagesList = document.getElementById("messagesList");
      if (messagesList) {
        messagesList.innerHTML =
          '<p class="text-muted">No messages available.</p>';
      }
    }
  }

  const messageForm = document.getElementById("messageForm");
  if (messageForm) {
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const content = document.getElementById("messageContent").value.trim();
      if (!content) {
        document.getElementById("messageContent-error").textContent =
          "Message cannot be empty.";
        document.getElementById("messageContent-error").style.display = "block";
        document.getElementById("messageContent").classList.add("is-invalid");
        return;
      }
      const admin = StorageManager.load("users").find(
        (u) => u.role === "admin"
      );
      if (!admin) {
        showToast("No admin found to send message.", "error");
        return;
      }
      MessageManager.sendMessage(currentUser.id, admin.id, content);
      showToast("Message sent to admin successfully!", "success");
      document.getElementById("messageContent").value = "";
      document.getElementById("messageContent-error").style.display = "none";
      document.getElementById("messageContent").classList.remove("is-invalid");
      loadMessages(); // Refresh the messages list
    });
  } else {
    console.error("messageForm element not found in DOM.");
  }

  const senderFilter = document.getElementById("senderFilter");
  if (senderFilter) {
    senderFilter.addEventListener("change", (e) => {
      loadMessages(e.target.value);
    });
  }

  const productFilter = document.getElementById("productFilter");
  if (productFilter) {
    productFilter.addEventListener("change", (e) => {
      loadReviews(e.target.value);
    });
  }

  populateProductFilter();
  populateSenderFilter();
  loadNotifications();
  loadReviews();
  loadMessages();
});
