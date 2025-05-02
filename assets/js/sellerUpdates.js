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

  function getMessages() {
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    const users = StorageManager.load("users") || [];
    const admin = users.find(u => u.role === "admin");
    const adminId = admin ? admin.id : null;
    console.log("Messages loaded:", messages);

    return messages
      .filter(message => 
        message.recipientId === currentUser.id || 
        (message.senderId === currentUser.id && message.recipientId === adminId)
      )
      .map(message => ({
        id: message.id,
        subject: message.subject || "No Subject",
        type: message.type || "other",
        content: message.content,
        timestamp: new Date(message.timestamp),
        senderId: message.senderId,
        senderName: message.senderId === currentUser.id ? "You" : "Admin"
      }));
  }

  function filterMessages() {
    filteredMessages = getMessages();
    currentPage = 1;
    renderMessagesTable();
  }

  function renderMessagesTable() {
    const tbody = document.getElementById("messagesTableBody");
    tbody.innerHTML = "";
    if (filteredMessages.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="7" class="text-center">No messages available</td>`;
      tbody.appendChild(row);
      return;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedMessages = filteredMessages.slice(start, end);

    paginatedMessages.forEach(message => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${message.id}</td>
        <td>${message.subject}</td>
        <td>${message.type}</td>
        <td class="last-message">${message.content}</td>
        <td>${message.timestamp.toLocaleString()}</td>
        <td>${message.senderName}</td>
        <td>
          <button class="btn btn-sm btn-primary view-message-btn" data-id="${message.id}">View</button>
        </td>
      `;
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
      } else if (column === "content") {
        valA = a.content;
        valB = b.content;
      } else if (column === "sender") {
        valA = a.senderName;
        valB = b.senderName;
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
    const messages = getMessages();
    filteredMessages = messages.filter(message =>
      message.subject.toLowerCase().includes(query) ||
      message.type.toLowerCase().includes(query) ||
      message.content.toLowerCase().includes(query) ||
      message.senderName.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderMessagesTable();
  };

  function viewMessage(messageId) {
    const message = filteredMessages.find(m => m.id === parseInt(messageId));
    if (!message) {
      showToast("Message not found.", "error");
      return;
    }

    document.getElementById("detail-subject").textContent = message.subject;
    document.getElementById("detail-type").textContent = message.type;
    document.getElementById("detail-sender").textContent = message.senderName;
    document.getElementById("detail-content").textContent = message.content;
    document.getElementById("detail-date").textContent = message.timestamp.toLocaleString();

    new bootstrap.Modal(document.getElementById("messageDetailModal")).show();
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
            <td colspan="7" class="text-center">No messages available</td>
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
      const messageId = event.target.dataset.id;
      viewMessage(messageId);
    }
  });

  populateProductFilter();
  loadNotifications();
  loadReviews();
  loadMessages();
});