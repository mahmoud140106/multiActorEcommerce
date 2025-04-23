import { ProductManager } from "./productManager.js";
import { StorageManager } from "./storageManager.js";
import { UserManager } from "./userManager.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", () => {
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  let isAdmin = false;

  function loadProducts() {
    const currentUser = StorageManager.load("currentUser");
    if (!currentUser || !["seller", "admin"].includes(currentUser.role)) {
      showToast("You must be logged in as a Seller or Admin to view products.", "error");
      window.location.href = "/index.html";
      return;
    }
    isAdmin = currentUser.role === "admin";
    const products = isAdmin
      ? ProductManager.getAllProductsForAdmin()
      : ProductManager.getProductsBySeller(currentUser.id);
    filteredProducts = [...products];
    updateTableHeaders();
    renderProductsTable();
  }

  function updateTableHeaders() {
    const thead = document.querySelector("thead tr");
    if (!thead) return;
    if (isAdmin && !thead.querySelector("#sellerUsernameHeader")) {
      const sellerUsernameHeader = document.createElement("th");
      sellerUsernameHeader.id = "sellerUsernameHeader";
      sellerUsernameHeader.style.cursor = "pointer";
      sellerUsernameHeader.onclick = () => sortTable("sellerId");
      sellerUsernameHeader.innerHTML = `Seller Name <span id="sort-sellerId"></span>`;
      thead.insertBefore(sellerUsernameHeader, thead.children[1]);
    } else if (!isAdmin && thead.querySelector("#sellerUsernameHeader")) {
      thead.querySelector("#sellerUsernameHeader").remove();
    }
  }

  function renderProductsTable() {
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = "";
    if (filteredProducts.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="${isAdmin ? 9 : 8}" class="text-center">No products available</td>
      `;
      tbody.appendChild(row);
      return;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    paginatedProducts.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>...${product.id % 1000}</td>
        ${isAdmin ? `<td>${UserManager.getUserNameById(product.sellerId) || "Unknown"}</td>` : ""}
        <td class="d-none d-md-table-cell"><img src="${
          product.images[0] ||
          "https://dummyimage.com/50x50/cccccc/ Booking.com 000000&text=No+Img"
        }" alt="${product.name}" 
        onerror="this.onerror=null; this.src='https://dummyimage.com/50x50/cccccc/000000&text=No+Img';" 
        style="height: 50px; width: 50px;"></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td class="d-none d-md-table-cell">$${product.price.toFixed(2)}</td>
        <td class="d-none d-md-table-cell">$${product.discount.toFixed(2)}</td>
        <td class="d-none d-md-table-cell">${product.stock}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary rounded-circle m-1 m-md-0" onclick="openEditProductModal(${
            product.id
          })"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger rounded-circle m-1 m-md-0" onclick="deleteProduct(${
            product.id
          })"><i class="fas fa-trash-alt"></i></button>
        </td>
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

  window.sortTable = (column) => {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }

    filteredProducts.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (column === "sellerId") {
        valA = UserManager.getUserNameById(a.sellerId) || "";
        valB = UserManager.getUserNameById(b.sellerId) || "";
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
    const currentUser = StorageManager.load("currentUser");
    const products = isAdmin
      ? ProductManager.getAllProductsForAdmin()
      : ProductManager.getProductsBySeller(currentUser.id);
    filteredProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (isAdmin &&
          UserManager.getUserNameById(p.sellerId)?.toLowerCase().includes(query))
    );
    currentPage = 1;
    renderProductsTable();
  };

  function handleImageUpload(files, urlInput, callback) {
    const imagePaths = [];
    const urls = urlInput
      ? urlInput
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url)
      : [];

    if (files && files.length) {
      Array.from(files).forEach((file) => {
        const imagePath = `/assets/images/${file.name}`;
        imagePaths.push(imagePath);
      });
    }

    imagePaths.push(...urls);
    callback(imagePaths);
  }

  function renderImagePreview(files, imagePaths) {
    const previewContainer = document.getElementById("imagePreview");
    previewContainer.innerHTML = "";
    const imagesToPreview = [];

    if (files && files.length) {
      Array.from(files).forEach((file) => {
        imagesToPreview.push({ src: URL.createObjectURL(file), isFile: true });
      });
    }

    if (imagePaths && imagePaths.length) {
      imagePaths.forEach((image) => {
        imagesToPreview.push({ src: image, isFile: false });
      });
    }

    if (imagesToPreview.length) {
      imagesToPreview.forEach(({ src }) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Preview";
        img.style.height = "100px";
        img.style.width = "100px";
        img.style.objectFit = "cover";
        img.style.margin = "5px";
        img.onerror = () => {
          img.src = "https://dummyimage.com/100x100/cccccc/000000&text=Invalid+URL";
        };
        previewContainer.appendChild(img);
      });
      previewContainer.style.display = "block";
    } else {
      previewContainer.style.display = "none";
    }
  }

  document.getElementById("productImage").addEventListener("change", (e) => {
    const files = e.target.files;
    const urlInput = document.getElementById("imageUrls").value;
    handleImageUpload(files, urlInput, (imagePaths) => {
      renderImagePreview(files, imagePaths);
    });
  });

  document.getElementById("imageUrls").addEventListener("input", (e) => {
    const urlInput = e.target.value;
    const files = document.getElementById("productImage").files;
    handleImageUpload(files, urlInput, (imagePaths) => {
      renderImagePreview(files, imagePaths);
    });
  });

  function populateSellerSelect() {
    const sellerSelect = document.getElementById("productSellerId");
    if (!sellerSelect) return;
    sellerSelect.innerHTML = `<option value="" disabled selected>Select seller</option>`;
    const users = StorageManager.load("users") || [];
    const sellers = users.filter((user) => user.role === "seller");
    sellers.forEach((seller) => {
      const option = document.createElement("option");
      option.value = seller.id;
      option.textContent = seller.userName;
      sellerSelect.appendChild(option);
    });
  }

  document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("productId").value);
    const files = document.getElementById("productImage").files;
    const urlInput = document.getElementById("imageUrls").value;
    const currentUser = StorageManager.load("currentUser");
    if (!currentUser || !["seller", "admin"].includes(currentUser.role)) {
      showToast("You must be logged in as a Seller or Admin to add/edit products.", "error");
      window.location.href = "/index.html";
      return;
    }

    handleImageUpload(files, urlInput, (imagePaths) => {
      const name = document.getElementById("productName").value;
      const category = document.getElementById("productCategory").value;
      const price = parseFloat(document.getElementById("productPrice").value);
      const discount = parseFloat(
        document.getElementById("productDiscount").value
      );
      const stock = parseInt(document.getElementById("productStock").value);
      let sellerId = currentUser.id;

      if (isAdmin) {
        const sellerIdInput = document.getElementById("productSellerId");
        sellerId = sellerIdInput ? parseInt(sellerIdInput.value) : currentUser.id;
        if (!sellerId || isNaN(sellerId)) {
          showToast("Please select a valid seller.", "error");
          return;
        }
      }

      if (isNaN(price) || isNaN(stock)) {
        showToast("Please enter valid price and stock.", "error");
        return;
      }

      const images = imagePaths.length
        ? imagePaths
        : ProductManager.getProduct(id)?.images || [];

      if (!isNaN(id) && ProductManager.getProduct(id)) {
        ProductManager.updateProduct(id, name, category, price, stock, images, sellerId, {
          discount,
        });
        showToast("Product updated successfully", "success");
      } else {
        const newId = Date.now();
        ProductManager.createProduct(
          newId,
          name,
          category,
          price,
          stock,
          images,
          sellerId,
          { discount }
        );
        showToast("Product added successfully", "success");
        // new bootstrap.Modal(document.getElementById("productModal")).hide();
      }

      filteredProducts = isAdmin
        ? [...ProductManager.getAllProductsForAdmin()]
        : [...ProductManager.getProductsBySeller(currentUser.id)];
      renderProductsTable();
      bootstrap.Modal.getInstance(
        document.getElementById("productModal")
      ).hide();
      // window.location.reload();

      document.getElementById("productName").value = "";
      document.getElementById("productCategory").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productDiscount").value = "";
      document.getElementById("productStock").value = "";
      document.getElementById("productImage").value = "";
      document.getElementById("imageUrls").value = "";
      if (isAdmin) {
        const sellerIdInput = document.getElementById("productSellerId");
        if (sellerIdInput) sellerIdInput.value = "";
      }
      renderImagePreview([], []);
    });
  });

  window.openAddProductModal = () => {
    document.getElementById("productModalLabel").textContent = "Add Product";
    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productDiscount").value = "";
    document.getElementById("productStock").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("imageUrls").value = "";
    if (isAdmin) {
      const form = document.getElementById("productForm");
      let sellerSelectContainer = document.getElementById("sellerSelectContainer");
      if (!sellerSelectContainer) {
        const sellerSelectDiv = document.createElement("div");
        sellerSelectDiv.className = "mb-3";
        sellerSelectDiv.id = "sellerSelectContainer";
        sellerSelectDiv.innerHTML = `
          <label for="productSellerId" class="form-label">Seller</label>
          <select class="form-control" id="productSellerId" required>
            <option value="" disabled selected>Select seller</option>
          </select>
        `;
        form.insertBefore(sellerSelectDiv, form.querySelector(".mb-3:last-child"));
      }
      populateSellerSelect();
    }
    renderImagePreview([], []);
    // new bootstrap.Modal(document.getElementById("productModal")).show();
  };

  window.openEditProductModal = (id) => {
    const productId = parseInt(id);
    const product = ProductManager.getProduct(productId);
    if (!product) {
      showToast("Product not found.", "error");
      return;
    }
    document.getElementById("productModalLabel").textContent = "Edit Product";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productDiscount").value = product.discount;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("imageUrls").value = product.images ? product.images.join(", ") : "";
    if (isAdmin) {
      const sellerIdInput = document.getElementById("productSellerId");
      if (sellerIdInput) {
        populateSellerSelect();
        sellerIdInput.value = product.sellerId;
      }
    }
    renderImagePreview(null, product.images || []);
    new bootstrap.Modal(document.getElementById("productModal")).show();
  };

  window.deleteProduct = (id) => {
    const productIdToDelete = parseInt(id);
    const confirmDeleteModal = new bootstrap.Modal(
      document.getElementById("confirmDeleteModal")
    );
    confirmDeleteModal.show();

    document.getElementById("confirmDeleteBtn").onclick = () => {
      ProductManager.deleteProduct(productIdToDelete);
      showToast("Product deleted successfully", "success");
      const currentUser = StorageManager.load("currentUser");
      filteredProducts = isAdmin
        ? [...ProductManager.getAllProductsForAdmin()]
        : [...ProductManager.getProductsBySeller(currentUser.id)];
      renderProductsTable();
      confirmDeleteModal.hide();
    };
  };

  loadProducts();
});