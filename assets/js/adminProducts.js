import { ProductManager } from "./productManager.js";
import { StorageManager } from "./storageManager.js";
import { CategoryManager } from "./categoryManager.js";
import { showToast } from "./toast.js";

// Active link
document.addEventListener("DOMContentLoaded", () => {
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

  // /////////////////

  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  let selectedStatus = "all"; // Default filter

  function loadProducts() {
    const currentUser = StorageManager.load("currentUser");
    if (!currentUser || currentUser.role !== "admin") {
      showToast("You must be logged in as an Admin to view products.", "error");
      window.location.href = "/index.html";
      return;
    }
    filterProductsByStatus();
  }

  function filterProductsByStatus() {
    const products = ProductManager.getAllProductsForAdmin();
    filteredProducts = products.filter((p) => {
      if (selectedStatus === "all") return true;
      if (selectedStatus === "deleted") return p.isDeleted === true;
      return p.status === selectedStatus && !p.isDeleted;
    });
    currentPage = 1;
    renderProductsTable();
  }

  function renderProductsTable() {
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = "";
    if (filteredProducts.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="9" class="text-center">No products available</td>
      `;
      tbody.appendChild(row);
      return;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    paginatedProducts.forEach((product) => {
      const category = CategoryManager.getCategory(product.categoryId);
      const users = StorageManager.load("users") || [];
      const seller = users.find((u) => u.id === product.sellerId);
      let actions = "";
      if (!product.isDeleted) {
        actions = `
          <div class="dropdown">
            <button class="btn btn-sm dropdown-toggle ${
              product.status === "pending"
                ? "bg-warning text-dark"
                : product.status === "accepted"
                ? "bg-success text-white"
                : product.status === "rejected"
                ? "bg-danger text-white"
                : "btn-secondary"
            }" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              ${product.status || "Change Status"}
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" onclick="openChangeStatusModal(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.sellerId}, 'pending')">Pending</a></li>
              <li><a class="dropdown-item" href="#" onclick="openChangeStatusModal(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.sellerId}, 'accepted')">Accepted</a></li>
              <li><a class="dropdown-item" href="#" onclick="openChangeStatusModal(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.sellerId}, 'rejected')">Rejected</a></li>
            </ul>
          </div>
          <button class="btn btn-sm btn-danger rounded-circle mt-1" onclick="softDeleteProduct(${product.id})" title="Soft Delete"><i class="fas fa-trash-alt"></i></button>
        `;
      } else {
        actions = `
          <button class="btn btn-sm btn-success rounded-circle m-1 m-md-0" onclick="restoreProduct(${product.id})" title="Restore"><i class="fas fa-undo"></i></button>
          <button class="btn btn-sm btn-danger rounded-circle m-1 m-md-0 mt-2" onclick="openHardDeleteModal(${product.id})" title="Hard Delete"><i class="fas fa-trash"></i></button>
        `;
      }
      const row = document.createElement("tr");
      row.className = product.isDeleted ? "table-danger" : "";
      row.innerHTML = `
        <td>...${product.id % 1000}</td>
        <td class="d-none d-md-table-cell"><img src="${
          product.images[0] ||
          "https://dummyimage.com/50x50/cccccc/000000&text=No+Img"
        }" alt="${product.name}" 
        onerror="this.onerror=null; this.src='https://dummyimage.com/50x50/cccccc/000000&text=No+Img';" 
        style="height: 50px; width: 50px;"></td>
        <td>${product.name}</td>
        <td>${category ? category.name : "Unknown"}</td>
        <td class="d-none d-md-table-cell">$${product.price.toFixed(2)}</td>
        <td class="d-none d-md-table-cell">$${product.discount.toFixed(2)}</td>
        <td class="d-none d-md-table-cell">${product.stock}</td>
        <td class="d-none d-md-table-cell" >${seller ? seller.userName : "Unknown"}</td>
        <td>${actions}</td>
      `;
      tbody.appendChild(row);
    });

    renderPagination();
  }

  function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

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
    if (page < 1 || page > Math.ceil(filteredProducts.length / itemsPerPage))
      return;
    currentPage = page;
    renderProductsTable();
  };

  window.openChangeStatusModal = (
    productId,
    productName,
    sellerId,
    newStatus
  ) => {
    const changeStatusModal = new bootstrap.Modal(
      document.getElementById("changeStatusModal")
    );
    changeStatusModal.show();

    const confirmChangeStatusBtn = document.getElementById(
      "confirmChangeStatusBtn"
    );
    const rejectReasonContainer = document.getElementById(
      "rejectReasonContainer"
    );
    const rejectReasonInput = document.getElementById("rejectReason");
    rejectReasonInput.value = "";
    rejectReasonContainer.style.display =
      newStatus === "rejected" ? "block" : "none";

    confirmChangeStatusBtn.onclick = () => {
      const reason = newStatus === "rejected" ? rejectReasonInput.value : "";
      ProductManager.updateProductStatus(productId, newStatus);
      ProductManager.sendNotification(
        sellerId,
        `Your product "${productName}" has been "${newStatus}" by the admin.${
          reason ? ` Reason: ${reason}` : ""
        }`
      );
      showToast(
        `Product status changed to ${newStatus} successfully`,
        "success"
      );
      filterProductsByStatus();
      changeStatusModal.hide();
    };
  };

  window.filterByStatus = () => {
    selectedStatus = document.getElementById("statusFilter").value;
    filterProductsByStatus();
  };

  window.sortTable = (column) => {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }

    filteredProducts.sort((a, b) => {
      let valA = a[column] || "";
      let valB = b[column] || "";

      if (column === "category") {
        const catA = CategoryManager.getCategory(a.categoryId);
        const catB = CategoryManager.getCategory(b.categoryId);
        valA = catA ? catA.name : "";
        valB = catB ? catB.name : "";
      } else if (column === "seller") {
        const users = StorageManager.load("users") || [];
        const sellerA = users.find((u) => u.id === a.sellerId);
        const sellerB = users.find((u) => u.id === b.sellerId);
        valA = sellerA ? sellerA.userName : "";
        valB = sellerB ? sellerB.userName : "";
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
    renderProductsTable();
  };

  window.searchProducts = () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const products = ProductManager.getAllProductsForAdmin().filter((p) => {
      if (selectedStatus === "all") return true;
      if (selectedStatus === "deleted") return p.isDeleted === true;
      return p.status === selectedStatus && !p.isDeleted;
    });
    const users = StorageManager.load("users") || [];
    filteredProducts = products.filter((p) => {
      const category = CategoryManager.getCategory(p.categoryId);
      const seller = users.find((u) => u.id === p.sellerId);
      return (
        p.name.toLowerCase().includes(query) ||
        (category && category.name.toLowerCase().includes(query)) ||
        (seller && seller.userName.toLowerCase().includes(query))
      );
    });
    currentPage = 1;
    renderProductsTable();
  };

  // Soft delete
  window.softDeleteProduct = (id) => {
    const productIdToDelete = parseInt(id);
    const confirmDeleteModal = new bootstrap.Modal(
      document.getElementById("confirmDeleteModal")
    );
    confirmDeleteModal.show();

    document.getElementById("confirmDeleteBtn").onclick = () => {
      ProductManager.deleteProduct(productIdToDelete);
      showToast("Product soft deleted successfully", "success");
      filterProductsByStatus();
      confirmDeleteModal.hide();
    };
  };

  // Restore
  window.restoreProduct = (id) => {
    ProductManager.restoreProduct(id);
    showToast("Product restored successfully", "success");
    filterProductsByStatus();
  };

  // Hard delete
  window.openHardDeleteModal = (id) => {
    const productIdToDelete = parseInt(id);
    const confirmHardDeleteModal = new bootstrap.Modal(
      document.getElementById("confirmHardDeleteModal")
    );
    // Check if product is linked to any orders
    const orders = (window.OrderManager ? window.OrderManager.getAllOrders() : (JSON.parse(localStorage.getItem('orders')) || []));
    const isLinked = orders.some(order => order.items.some(item => item.productId === productIdToDelete));
    const hardDeleteBody = document.getElementById("confirmHardDeleteBody");
    if (isLinked) {
      hardDeleteBody.innerHTML = `<span class='text-danger fw-bold'>Cannot hard delete: This product is linked to existing orders.</span>`;
      document.getElementById("confirmHardDeleteBtn").style.display = "none";
    } else {
      hardDeleteBody.innerHTML = `Are you sure you want to <b>permanently delete</b> this product? This action cannot be undone.`;
      document.getElementById("confirmHardDeleteBtn").style.display = "inline-block";
      document.getElementById("confirmHardDeleteBtn").onclick = () => {
        ProductManager.hardDeleteProduct(productIdToDelete);
        showToast("Product permanently deleted", "success");
        filterProductsByStatus();
        confirmHardDeleteModal.hide();
      };
    }
    confirmHardDeleteModal.show();
  };

  loadProducts();
});
