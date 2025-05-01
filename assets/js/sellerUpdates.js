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

  let filteredConversations = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  let selectedSender = ""; // Default filter

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
      if (message.senderId !== currentUser.id) {
        const otherUserId = message.senderId;
        senders.add(otherUserId);
      }
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

  function hasSellerReplied(conversation) {
    const messages = conversation.messages;
    const lastIncomingMessageIndex = messages
      .map((msg, index) => (msg.senderId !== currentUser.id ? index : -1))
      .reduce((max, curr) => Math.max(max, curr), -1);
    
    if (lastIncomingMessageIndex === -1) return false;
    
    return messages.slice(lastIncomingMessageIndex + 1).some(msg => msg.senderId === currentUser.id);
  }

  function getConversations() {
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    const users = StorageManager.load("users") || [];
    const groupedMessages = {};

    messages.forEach((message) => {
      const otherUserId = message.senderId === currentUser.id ? message.recipientId : message.senderId;
      if (!groupedMessages[otherUserId]) {
        groupedMessages[otherUserId] = [];
      }
      groupedMessages[otherUserId].push(message);
    });

    const conversations = [];
    Object.entries(groupedMessages).forEach(([otherUserId, userMessages], index) => {
      const hasIncomingMessages = userMessages.some(message => message.senderId !== currentUser.id);
      if (hasIncomingMessages) {
        conversations.push({
          id: index + 1,
          otherUserId: parseInt(otherUserId),
          messages: userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
          latestTimestamp: userMessages.reduce((latest, msg) => {
            const msgDate = new Date(msg.timestamp);
            return latest > msgDate ? latest : msgDate;
          }, new Date(userMessages[0].timestamp))
        });
      }
    });

    return conversations;
  }

  function filterConversationsBySender() {
    const conversations = getConversations();
    filteredConversations = conversations.filter(conversation =>
      selectedSender === "" ? true : conversation.otherUserId === parseInt(selectedSender)
    );
    currentPage = 1;
    renderConversationsTable();
  }

  function renderConversationsTable() {
    const tbody = document.getElementById("conversationsTableBody");
    tbody.innerHTML = "";
    if (filteredConversations.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="6" class="text-center">No conversations available</td>
      `;
      tbody.appendChild(row);
      return;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedConversations = filteredConversations.slice(start, end);

    const users = StorageManager.load("users") || [];
    paginatedConversations.forEach(conversation => {
      const otherUser = users.find(u => u.id === conversation.otherUserId);
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      const isReplied = hasSellerReplied(conversation);
      const row = document.createElement("tr");
      if (isReplied) {
        row.classList.add("replied");
      }
      row.innerHTML = `
        <td>${conversation.id}</td>
        <td>
          ${otherUser ? otherUser.userName : "Unknown"}
          ${isReplied ? '<i class="fas fa-check replied-icon"></i>' : ''}
        </td>
        <td>${otherUser ? otherUser.role : "unknown"}</td>
        <td class="last-message" title="${lastMessage.content}">
          ${lastMessage.content.substring(0, 50)}${lastMessage.content.length > 50 ? "..." : ""}
        </td>
        <td>${new Date(lastMessage.timestamp).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-primary view-message-btn" data-id="${conversation.otherUserId}">View</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    renderPagination();
  }

  function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const pageCount = Math.ceil(filteredConversations.length / itemsPerPage);

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
    if (page < 1 || page > Math.ceil(filteredConversations.length / itemsPerPage)) return;
    currentPage = page;
    renderConversationsTable();
  };

  window.filterBySender = () => {
    selectedSender = document.getElementById("senderFilter").value;
    filterConversationsBySender();
  };

  window.sortTable = (column) => {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }

    filteredConversations.sort((a, b) => {
      const users = StorageManager.load("users") || [];
      let valA, valB;

      if (column === "sender") {
        const senderA = users.find(u => u.id === a.otherUserId);
        const senderB = users.find(u => u.id === b.otherUserId);
        valA = senderA ? senderA.userName : "";
        valB = senderB ? senderB.userName : "";
      } else if (column === "role") {
        const senderA = users.find(u => u.id === a.otherUserId);
        const senderB = users.find(u => u.id === b.otherUserId);
        valA = senderA ? senderA.role : "";
        valB = senderB ? senderB.role : "";
      } else if (column === "message") {
        valA = a.messages[a.messages.length - 1].content;
        valB = b.messages[b.messages.length - 1].content;
      } else if (column === "date") {
        valA = new Date(a.latestTimestamp);
        valB = new Date(b.latestTimestamp);
      } else {
        valA = a[column] || "";
        valB = b[column] || "";
      }

      if (typeof valA === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    document.querySelectorAll("th span").forEach(span => (span.innerHTML = ""));
    document.getElementById(`sort-${column}`).innerHTML = sortDirection === "asc" ? "↑" : "↓";

    currentPage = 1;
    renderConversationsTable();
  };

  window.searchConversations = () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const conversations = getConversations();
    const users = StorageManager.load("users") || [];
    filteredConversations = conversations.filter(conversation => {
      const otherUser = users.find(u => u.id === conversation.otherUserId);
      return (
        (otherUser && otherUser.userName.toLowerCase().includes(query)) ||
        (otherUser && otherUser.role.toLowerCase().includes(query)) ||
        conversation.messages.some(msg => msg.senderId !== currentUser.id && msg.content.toLowerCase().includes(query))
      );
    });
    currentPage = 1;
    renderConversationsTable();
  };

  function viewMessage(otherUserId) {
    const conversation = filteredConversations.find(c => c.otherUserId === parseInt(otherUserId));
    if (!conversation) {
      showToast("Conversation not found.", "error");
      return;
    }

    const users = StorageManager.load("users") || [];
    const otherUser = users.find(u => u.id === conversation.otherUserId);
    document.getElementById("detail-sender").textContent = otherUser ? `${otherUser.userName} (${otherUser.role})` : "Unknown";
    
    const detailMessages = document.getElementById("detail-messages");
    detailMessages.innerHTML = "<strong>Messages:</strong>";
    const incomingMessages = conversation.messages.filter(message => message.senderId !== currentUser.id);
    if (incomingMessages.length === 0) {
      detailMessages.innerHTML += `<p class="text-muted">No incoming messages.</p>`;
    } else {
      incomingMessages.forEach(message => {
        detailMessages.innerHTML += `
          <div class="message-item received p-3 bg-light rounded mb-2">
            <p class="mb-1">${message.content}</p>
            <small class="text-muted">${new Date(message.timestamp).toLocaleString()}</small>
          </div>`;
      });
    }

    document.getElementById("seller-response").value = "";
    const sendResponseBtn = document.getElementById("send-response-btn");
    sendResponseBtn.dataset.id = otherUserId;

    new bootstrap.Modal(document.getElementById("messageDetailModal")).show();
  }

  function sendReply(otherUserId) {
    const replyInput = document.getElementById("seller-response").value.trim();
    if (!replyInput) {
      showToast("Reply cannot be empty.", "error");
      return;
    }

    MessageManager.sendMessage(currentUser.id, parseInt(otherUserId), replyInput);
    showToast("Reply sent successfully!", "success");
    loadMessages();
    new bootstrap.Modal(document.getElementById("messageDetailModal")).hide();
  }

  function loadMessages(filterSenderId = "") {
    try {
      selectedSender = filterSenderId;
      filterConversationsBySender();
    } catch (error) {
      console.error("Error loading messages:", error);
      const tbody = document.getElementById("conversationsTableBody");
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center">No conversations available</td>
          </tr>
        `;
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
      loadMessages();
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

  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-message-btn")) {
      const otherUserId = event.target.dataset.id;
      viewMessage(otherUserId);
    }
  });

  document.getElementById("send-response-btn").addEventListener("click", () => {
    const otherUserId = document.getElementById("send-response-btn").dataset.id;
    sendReply(otherUserId);
  });

  populateProductFilter();
  populateSenderFilter();
  loadNotifications();
  loadReviews();
  loadMessages();
});