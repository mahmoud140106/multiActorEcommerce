document.addEventListener("DOMContentLoaded", function () {
    const messagesTableBody = document.getElementById("messagesTableBody");

    if (!messagesTableBody) {
        console.error("messagesTableBody not found!");
        return;
    }

    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("view-message-btn")) {
            const messageId = event.target.dataset.id;
            viewMessage(messageId);
        }
    });

    document.getElementById("send-response-btn").addEventListener("click", function () {
        const messageId = this.dataset.id;
        sendAdminReply(messageId);
    });

    loadMessages(); // Load messages when the page loads
});



function loadMessages() {
    let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
    let tableBody = document.getElementById("messagesTableBody");
    tableBody.innerHTML = "";

    messages.forEach((msg) => {
        let row = `
            <tr data-id="${msg.id}">
                <td>${msg.id}</td>
                <td>${msg.subject}</td>
                <td>${msg.type}</td>
                <td>${msg.userEmail || 'N/A'}</td>
                <td>${msg.timestamp}</td>
                <td><span class="badge ${msg.status === 'Open' ? 'bg-warning' : 'bg-success'}">${msg.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary view-message-btn" data-id="${msg.id}">View</button>
                </td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}



function viewMessage(id) {
    let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
    let msg = messages.find(m => m.id == id);

    if (!msg) {
        console.error("Message not found.");
        return;
    }

    document.getElementById("detail-email").textContent = msg.userEmail || "N/A";
    document.getElementById("detail-subject").textContent = msg.subject;
    document.getElementById("detail-message").textContent = msg.content;
    document.getElementById("admin-response").value = msg.reply || "";

    const sendResponseBtn = document.getElementById("send-response-btn");
    if (sendResponseBtn) {
        sendResponseBtn.dataset.id = msg.id;
    } else {
        console.error("send-response-btn not found!");
    }

    new bootstrap.Modal(document.getElementById("messageDetailModal")).show();
}

function sendAdminReply(id) {
    let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
    let msgIndex = messages.findIndex(m => m.id == id);
    let replyInput = document.getElementById("admin-response").value.trim();

    if (msgIndex !== -1 && replyInput) {
        messages[msgIndex].reply = replyInput;
        messages[msgIndex].status = "Responded";
        localStorage.setItem("customerMessages", JSON.stringify(messages));

        loadMessages(); // Refresh table dynamically
        new bootstrap.Modal(document.getElementById("messageDetailModal")).hide();
    } else {
        console.error("Message not found or empty reply.");
    }
}
document.getElementById("messageStatusFilter").addEventListener("change", function () {
    filterMessages(this.value);
});

function filterMessages(status) {
    let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
    let tableBody = document.getElementById("messagesTableBody");
    tableBody.innerHTML = "";

    let filteredMessages = messages.filter(msg => {
        if (status === "all") return true;
        if (status === "responded") return msg.status === "Responded";
        if (status === "not-responded") return msg.status === "Open";
        return true;
    });

    filteredMessages.forEach((msg) => {
        let row = `
            <tr data-id="${msg.id}">
                <td>${msg.id}</td>
                <td>${msg.subject}</td>
                <td>${msg.type}</td>
                <td>${msg.userEmail || 'N/A'}</td>
                <td>${msg.timestamp}</td>
                <td><span class="badge ${msg.status === 'Open' ? 'bg-warning' : 'bg-success'}">${msg.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary view-message-btn" data-id="${msg.id}">View</button>
                </td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}
document.getElementById("searchMessages").addEventListener("input", function () {
    searchMessages(this.value.trim().toLowerCase());
});

function searchMessages(query) {
    let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
    let tableBody = document.getElementById("messagesTableBody");
    tableBody.innerHTML = "";

    let filteredMessages = messages.filter(msg =>
        msg.subject.toLowerCase().includes(query) || 
        msg.type.toLowerCase().includes(query) || 
        msg.userEmail.toLowerCase().includes(query)
    );

    filteredMessages.forEach((msg) => {
        let row = `
            <tr data-id="${msg.id}">
                <td>${msg.id}</td>
                <td>${msg.subject}</td>
                <td>${msg.type}</td>
                <td>${msg.userEmail || 'N/A'}</td>
                <td>${msg.timestamp}</td>
                <td><span class="badge ${msg.status === 'Open' ? 'bg-warning' : 'bg-success'}">${msg.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary view-message-btn" data-id="${msg.id}">View</button>
                </td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}
