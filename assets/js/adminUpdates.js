import { StorageManager } from "./storageManager.js";
import { MessageManager } from "./messageManager.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = StorageManager.load("currentUser");
  if (!currentUser || currentUser.role !== "admin") {
    showToast("You must be logged in as an Admin to view messages.", "error");
    window.location.href = "/index.html";
    return;
  }

  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  navLinks.forEach((link) => {
    if (link.getAttribute("href").includes("messages.html")) {
      link.classList.add("active");
    }
  });

  let filteredMessages = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  let selectedSender = "";

  function loadMessages() {
    filterMessagesBySender();
  }

  function populateSenderFilter() {
    const senderFilter = document.getElementById("senderFilter");
    const users = StorageManager.load("users") || [];
    const senders = new Set();
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    messages.forEach((message) => {
      if (message.senderId !== currentUser.id) {
        senders.add(message.senderId);
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

  function populateRecipientFilter() {
    const recipientFilter = document.getElementById("recipientFilter");
    const users = StorageManager.load("users") || [];
    console.log("Users loaded for recipient filter:", users);
    const sellersAndCustomers = users.filter(
      (user) => user.role === "seller" || user.role === "customer"
    );

    if (sellersAndCustomers.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No recipients available";
      option.disabled = true;
      recipientFilter.appendChild(option);
      showToast(
        "No sellers or customers available to send messages to.",
        "warning"
      );
      return;
    }

    sellersAndCustomers.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `${user.userName} (${user.role})`;
      recipientFilter.appendChild(option);
    });
  }

  function getMessages() {
    const messages = MessageManager.getMessagesForUser(currentUser.id);
    const users = StorageManager.load("users") || [];
    console.log("Messages loaded:", messages);
    return messages
      .filter((message) => message.senderId !== currentUser.id)
      .map((message, index) => ({
        id: index + 1,
        senderId: message.senderId,
        sender:
          users.find((u) => u.id === message.senderId)?.userName || "Unknown",
        subject: message.subject || "No Subject",
        type: message.type || "other",
        content: message.content,
        timestamp: new Date(message.timestamp),
        status: message.status || "Open",
        reply: message.reply || null,
        originalMessageId: message.id,
      }));
  }

  function filterMessagesBySender() {
    const messages = getMessages();
    filteredMessages = messages.filter((message) =>
      selectedSender === ""
        ? true
        : message.senderId === parseInt(selectedSender)
    );
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

    paginatedMessages.forEach((message) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${message.id}</td>
        <td>${message.subject}</td>
        <td>${message.type}</td>
        <td>${message.sender}</td>
        <td>${message.timestamp.toLocaleString()}</td>
        <td>
          <span class="status-${message.status.toLowerCase()}">${
        message.status
      }</span>
        </td>
        <td>
          <button class="btn btn-sm btn-primary view-message-btn" data-id="${
            message.id
          }">View</button>
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
    prevLi.innerHTML = `<a class="page-link ms-1 rounded-circle" href="#" onclick="changePage(${
      currentPage - 1
    })"><i class="fas fa-chevron-left"></i></a>`;
    pagination.appendChild(prevLi);

    for (let i = 1; i <= pageCount; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link ms-1 rounded-circle" href="#" onclick="changePage(${i})">${i}</a>`;
      pagination.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${
      currentPage === pageCount ? "disabled" : ""
    }`;
    nextLi.innerHTML = `<a class="page-link ms-1 rounded-circle" href="#" onclick="changePage(${
      currentPage + 1
    })"><i class="fas fa-chevron-right"></i></a>`;
    pagination.appendChild(nextLi);
  }

  window.changePage = (page) => {
    if (page < 1 || page > Math.ceil(filteredMessages.length / itemsPerPage))
      return;
    currentPage = page;
    renderMessagesTable();
  };

  window.filterBySender = () => {
    selectedSender = document.getElementById("senderFilter").value;
    filterMessagesBySender();
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
      }
      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    document
      .querySelectorAll("th span")
      .forEach((span) => (span.innerHTML = ""));
    document.getElementById(`sort-${column}`).innerHTML =
      sortDirection === "asc" ? "↑" : "↓";

    currentPage = 1;
    renderMessagesTable();
  };

  window.searchMessages = () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const messages = getMessages();
    filteredMessages = messages.filter(
      (message) =>
        message.sender.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.type.toLowerCase().includes(query) ||
        message.content.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderMessagesTable();
  };

  function viewMessage(messageId) {
    const message = filteredMessages.find((m) => m.id === parseInt(messageId));
    if (!message) {
      showToast("Message not found.", "error");
      return;
    }

    document.getElementById("detail-sender").textContent = message.sender;
    document.getElementById("detail-subject").textContent = message.subject;
    document.getElementById("detail-type").textContent = message.type;
    document.getElementById("detail-status").textContent = message.status;

    const detailMessages = document.getElementById("detail-messages");
    detailMessages.innerHTML = "<strong>Messages:</strong>";
    detailMessages.innerHTML += `
      <div class="message-item received p-3 bg-light rounded mb-2">
        <p class="mb-1">${message.content}</p>
        <small class="text-muted">${message.timestamp.toLocaleString()}</small>
      </div>`;
    if (message.reply) {
      detailMessages.innerHTML += `
        <div class="message-item sent p-3 bg-primary-subtle rounded mb-2">
          <p class="mb-1">${message.reply}</p>
          <small class="text-muted">${message.timestamp.toLocaleString()}</small>
        </div>`;
    }

    document.getElementById("admin-response").value = "";
    const sendResponseBtn = document.getElementById("send-response-btn");
    sendResponseBtn.dataset.id = messageId;

    new bootstrap.Modal(document.getElementById("messageDetailModal")).show();
  }

  function sendAdminReply(messageId) {
    const replyInput = document.getElementById("admin-response").value.trim();
    if (!replyInput) {
      showToast("Reply cannot be empty.", "error");
      return;
    }

    const message = filteredMessages.find((m) => m.id === parseInt(messageId));
    if (!message) {
      showToast("Message not found.", "error");
      return;
    }

    console.log("Sending reply for message:", message);
    const messages = StorageManager.load("messages") || [];
    const originalMessage = messages.find(
      (m) => m.id === message.originalMessageId
    );
    if (originalMessage) {
      originalMessage.reply = replyInput;
      originalMessage.status = "Responded";
      StorageManager.save("messages", messages);
      console.log("Updated messages in storage:", messages);
      showToast("Reply sent successfully!", "success");
      loadMessages();
      new bootstrap.Modal(document.getElementById("messageDetailModal")).hide();
    } else {
      console.log(
        "Original message not found in storage:",
        message.originalMessageId
      );
      showToast("Failed to send reply. Message not found.", "error");
    }
  }

  function sendMessageFromModal() {
    const recipientId = document.getElementById("recipientFilter").value;
    const subject = document.getElementById("messageSubject").value.trim();
    const type = document.getElementById("messageType").value;
    const content = document.getElementById("messageContent").value.trim();

    if (!recipientId) {
      document.getElementById("recipientFilter-error").style.display = "block";
      document.getElementById("recipientFilter").classList.add("is-invalid");
      return;
    }
    if (!subject) {
      document.getElementById("messageSubject-error").textContent =
        "Subject cannot be empty.";
      document.getElementById("messageSubject-error").style.display = "block";
      document.getElementById("messageSubject").classList.add("is-invalid");
      return;
    }
    if (!type) {
      document.getElementById("messageType-error").textContent =
        "Type cannot be empty.";
      document.getElementById("messageType-error").style.display = "block";
      document.getElementById("messageType").classList.add("is-invalid");
      return;
    }
    if (!content) {
      document.getElementById("messageContent-error").textContent =
        "Message cannot be empty.";
      document.getElementById("messageContent-error").style.display = "block";
      document.getElementById("messageContent").classList.add("is-invalid");
      return;
    }

    MessageManager.sendMessage(
      currentUser.id,
      parseInt(recipientId),
      subject,
      type,
      content
    );
    showToast("Message sent successfully!", "success");
    document.getElementById("recipientFilter").value = "";
    document.getElementById("messageSubject").value = "";
    document.getElementById("messageType").value = "";
    document.getElementById("messageContent").value = "";
    document.getElementById("recipientFilter-error").style.display = "none";
    document.getElementById("messageSubject-error").style.display = "none";
    document.getElementById("messageType-error").style.display = "none";
    document.getElementById("messageContent-error").style.display = "none";
    document.getElementById("recipientFilter").classList.remove("is-invalid");
    document.getElementById("messageSubject").classList.remove("is-invalid");
    document.getElementById("messageType").classList.remove("is-invalid");
    document.getElementById("messageContent").classList.remove("is-invalid");
    new bootstrap.Modal(document.getElementById("sendMessageModal")).hide();
    loadMessages();
  }

  const confirmSendMessageBtn = document.getElementById(
    "confirmSendMessageBtn"
  );
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

  document.getElementById("send-response-btn").addEventListener("click", () => {
    const messageId = document.getElementById("send-response-btn").dataset.id;
    sendAdminReply(messageId);
  });

  populateSenderFilter();
  populateRecipientFilter();
  loadMessages();
});
