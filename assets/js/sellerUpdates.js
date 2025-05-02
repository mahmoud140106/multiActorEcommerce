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

  let filteredMessages = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  let showUnreadOnly = false;

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

  function getConversations() {
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    const users = StorageManager.load("users") || [];
    const admin = users.find(u => u.role === "admin");
    const adminId = admin ? admin.id : null;
    console.log("Messages loaded:", messages);

    // Group messages by subject and type to form conversations
    const conversations = [];
    const groupedMessages = {};

    messages
      .filter(message => 
        message.recipientId === currentUser.id || 
        (message.senderId === currentUser.id && message.recipientId === adminId)
      )
      .forEach(message => {
        const key = `${message.subject}-${message.type}`;
        if (!groupedMessages[key]) {
          groupedMessages[key] = {
            id: Object.keys(groupedMessages).length + 1,
            subject: message.subject || "No Subject",
            type: message.type || "other",
            messages: [],
            timestamp: new Date(message.timestamp),
            status: message.status || "Open",
            read: message.read || false,
            originalMessageId: message.id
          };
        }
        groupedMessages[key].messages.push(message);
        // Update timestamp to the latest message
        const messageTimestamp = new Date(message.timestamp);
        if (messageTimestamp > groupedMessages[key].timestamp) {
          groupedMessages[key].timestamp = messageTimestamp;
        }
        // Update status if any message has a reply
        if (message.reply) {
          groupedMessages[key].status = "Responded";
        }
      });

    for (const key in groupedMessages) {
      conversations.push(groupedMessages[key]);
    }

    return conversations.map(conversation => ({
      id: conversation.id,
      subject: conversation.subject,
      type: conversation.type,
      lastMessage: conversation.messages[conversation.messages.length - 1].reply || 
                  conversation.messages[conversation.messages.length - 1].content,
      timestamp: conversation.timestamp,
      status: conversation.status,
      read: conversation.read,
      messages: conversation.messages,
      originalMessageId: conversation.originalMessageId
    }));
  }

  function filterMessages() {
    const conversations = getConversations();
    filteredMessages = conversations.filter(conversation => 
      !showUnreadOnly || !conversation.read
    );
    currentPage = 1;
    renderMessagesTable();
  }

  function renderMessagesTable() {
    const tbody = document.getElementById("messagesTableBody");
    tbody.innerHTML = "";
    if (filteredMessages.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="7" class="text-center">No conversations available</td>`;
      tbody.appendChild(row);
      return;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedMessages = filteredMessages.slice(start, end);

    paginatedMessages.forEach(conversation => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${conversation.id}</td>
        <td>${conversation.subject}</td>
        <td>${conversation.type}</td>
        <td class="last-message">${conversation.lastMessage}</td>
        <td>${conversation.timestamp.toLocaleString()}</td>
        <td>
          <span class="status-${conversation.status.toLowerCase()}">${conversation.status}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-primary view-message-btn" data-id="${conversation.id}">View</button>
        </td>
      `;
      if (!conversation.read) {
        row.classList.add("table-warning");
      }
      tbody.appendChild(row);
    });

    renderPagination();
  }

  function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const pageCount = Math.ceil(filteredMessages.length / itemsPerPage);

    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link ms-1 rounded-circle" href="#" onclick="changePage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></a>`;
    pagination.appendChild(prevLi);

    for (let i = 1; i <= pageCount; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link ms-1 rounded-circle" href="#" onclick="changePage(${i})">${i}</a>`;
      pagination.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === pageCount ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link ms-1 rounded-circle" href="#" onclick="changePage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></a>`;
    pagination.appendChild(nextLi);
  }

  window.changePage = (page) => {
    if (page < 1 || page > Math.ceil(filteredMessages.length / itemsPerPage)) return;
    currentPage = page;
    renderMessagesTable();
  };

  window.toggleUnreadFilter = () => {
    showUnreadOnly = document.getElementById("unreadFilter").checked;
    filterMessages();
  };

  window.sortTable = (column) => {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }

    filteredMessages.sort((a, b) => {
      let valA = a[column] || "";
      let valB = b[column] || "";
      if (column === "date") {
        valA = a.timestamp;
        valB = b.timestamp;
      } else if (column === "lastMessage") {
        valA = a.lastMessage;
        valB = b.lastMessage;
      }
      if (typeof valA === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    document.querySelectorAll("th span").forEach(span => (span.innerHTML = ""));
    document.getElementById(`sort-${column}`).innerHTML = sortDirection === "asc" ? "↑" : "↓";

    currentPage = 1;
    renderMessagesTable();
  };

  window.searchMessages = () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const conversations = getConversations();
    filteredMessages = conversations.filter(conversation =>
      conversation.subject.toLowerCase().includes(query) ||
      conversation.type.toLowerCase().includes(query) ||
      conversation.lastMessage.toLowerCase().includes(query)
    );
    if (showUnreadOnly) {
      filteredMessages = filteredMessages.filter(conversation => !conversation.read);
    }
    currentPage = 1;
    renderMessagesTable();
  };

  function viewMessage(conversationId) {
    const conversation = filteredMessages.find(c => c.id === parseInt(conversationId));
    if (!conversation) {
      showToast("Conversation not found.", "error");
      return;
    }

    document.getElementById("detail-subject").textContent = conversation.subject;
    document.getElementById("detail-type").textContent = conversation.type;
    document.getElementById("detail-status").textContent = conversation.status;

    const detailMessages = document.getElementById("detail-messages");
    detailMessages.innerHTML = "<strong>Conversation:</strong>";
    conversation.messages.forEach(message => {
      detailMessages.innerHTML += `
        <div class="message-item ${message.senderId === currentUser.id ? 'sent' : 'received'} p-3 ${message.senderId === currentUser.id ? 'bg-primary-subtle' : 'bg-light'} rounded mb-2">
          <p class="mb-1"><strong>${message.senderId === currentUser.id ? 'You' : 'Admin'}:</strong> ${message.content}</p>
          <small class="text-muted">${new Date(message.timestamp).toLocaleString()}</small>
        </div>`;
      if (message.reply) {
        detailMessages.innerHTML += `
          <div class="message-item ${message.senderId === currentUser.id ? 'received' : 'sent'} p-3 ${message.senderId === currentUser.id ? 'bg-light' : 'bg-primary-subtle'} rounded mb-2">
            <p class="mb-1"><strong>${message.senderId === currentUser.id ? 'Admin' : 'You'}:</strong> ${message.reply}</p>
            <small class="text-muted">${new Date(message.timestamp).toLocaleString()}</small>
          </div>`;
      }
    });

    // Mark conversation as read
    conversation.messages.forEach(message => {
      const messages = StorageManager.load("messages") || [];
      const originalMessage = messages.find(m => m.id === message.id);
      if (originalMessage) {
        originalMessage.read = true;
        StorageManager.save("messages", messages);
      }
    });
    conversation.read = true;
    renderMessagesTable();

    document.getElementById("seller-response").value = "";
    const sendResponseBtn = document.getElementById("send-response-btn");
    sendResponseBtn.dataset.id = conversationId;

    new bootstrap.Modal(document.getElementById("messageDetailModal")).show();
  }

  function sendReply(conversationId) {
    const replyInput = document.getElementById("seller-response").value.trim();
    if (!replyInput) {
      showToast("Reply cannot be empty.", "error");
      return;
    }

    const conversation = filteredMessages.find(c => c.id === parseInt(conversationId));
    if (!conversation) {
      showToast("Conversation not found.", "error");
      return;
    }

    console.log("Sending reply for conversation:", conversation);
    const messages = StorageManager.load("messages") || [];
    const originalMessage = messages.find(m => m.id === conversation.originalMessageId);
    if (originalMessage) {
      originalMessage.reply = replyInput;
      originalMessage.status = "Open"; // Reset status to Open for new reply
      originalMessage.timestamp = new Date().toISOString();
      StorageManager.save("messages", messages);
      console.log("Updated messages in storage:", messages);
      showToast("Reply sent successfully!", "success");
      loadMessages();
      new bootstrap.Modal(document.getElementById("messageDetailModal")).hide();
    } else {
      console.log("Original message not found in storage:", conversation.originalMessageId);
      showToast("Failed to send reply. Message not found.", "error");
    }
  }

  function sendMessageFromModal() {
    const subject = document.getElementById("messageSubject").value.trim();
    const type = document.getElementById("messageType").value;
    const content = document.getElementById("messageContentModal").value.trim();

    if (!subject) {
      document.getElementById("messageSubject-error").textContent = "Subject cannot be empty.";
      document.getElementById("messageSubject-error").style.display = "block";
      document.getElementById("messageSubject").classList.add("is-invalid");
      return;
    }
    if (!type) {
      document.getElementById("messageType-error").textContent = "Type cannot be empty.";
      document.getElementById("messageType-error").style.display = "block";
      document.getElementById("messageType").classList.add("is-invalid");
      return;
    }
    if (!content) {
      document.getElementById("messageContentModal-error").textContent = "Message cannot be empty.";
      document.getElementById("messageContentModal-error").style.display = "block";
      document.getElementById("messageContentModal").classList.add("is-invalid");
      return;
    }

    const admin = StorageManager.load("users").find(u => u.role === "admin");
    if (!admin) {
      showToast("No admin found to send message.", "error");
      return;
    }

    MessageManager.sendMessage(currentUser.id, admin.id, subject, type, content);
    showToast("Message sent successfully!", "success");
    document.getElementById("messageSubject").value = "";
    document.getElementById("messageType").value = "";
    document.getElementById("messageContentModal").value = "";
    document.getElementById("messageSubject-error").style.display = "none";
    document.getElementById("messageType-error").style.display = "none";
    document.getElementById("messageContentModal-error").style.display = "none";
    document.getElementById("messageSubject").classList.remove("is-invalid");
    document.getElementById("messageType").classList.remove("is-invalid");
    document.getElementById("messageContentModal").classList.remove("is-invalid");
    new bootstrap.Modal(document.getElementById("sendMessageModal")).hide();
    loadMessages();
  }

  function loadMessages() {
    try {
      filterMessages();
    } catch (error) {
      console.error("Error loading messages:", error);
      const tbody = document.getElementById("messagesTableBody");
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center">No conversations available</td>
          </tr>
        `;
      }
    }
  }

  const productFilter = document.getElementById("productFilter");
  if (productFilter) {
    productFilter.addEventListener("change", (e) => {
      loadReviews(e.target.value);
    });
  }

  const confirmSendMessageBtn = document.getElementById("confirmSendMessageBtn");
  if (confirmSendMessageBtn) {
    confirmSendMessageBtn.addEventListener("click", sendMessageFromModal);
  } else {
    console.error("confirmSendMessageBtn element not found in DOM.");
  }

  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-message-btn")) {
      const conversationId = event.target.dataset.id;
      viewMessage(conversationId);
    }
  });

  document.getElementById("send-response-btn").addEventListener("click", () => {
    const conversationId = document.getElementById("send-response-btn").dataset.id;
    sendReply(conversationId);
  });

  populateProductFilter();
  loadNotifications();
  loadReviews();
  loadMessages();
});