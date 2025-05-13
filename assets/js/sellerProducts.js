import { ProductManager } from "./productManager.js";
import { StorageManager } from "./storageManager.js";
import { CategoryManager } from "./categoryManager.js";
import { showToast } from "./toast.js";

// active link
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

  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  let selectedImages = []; // Store selected images (files or paths)

  function loadProducts() {
    const currentUser = StorageManager.load("currentUser");
    if (!currentUser || currentUser.role !== "seller") {
      showToast(
        "You must be logged in as a Seller to view products.",
        "error"
      );
      window.location.href = "/index.html";
      return;
    }
    const products = ProductManager.getProductsBySeller(currentUser.id);
    filteredProducts = [...products];
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
      const statusClass = product.isDeleted ? "bg-danger text-white" :
                         product.status === "pending" ? "bg-warning text-dark" :
                         product.status === "accepted" ? "bg-success text-white" :
                         product.status === "rejected" ? "bg-danger text-white" : "bg-secondary text-white";
      const statusText = product.isDeleted ? "Deleted" :
                        product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "Unknown";
      const statusContent = product.status === "rejected" && product.rejectReason
        ? `<span class="badge ${statusClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${product.rejectReason}">${statusText}</span>`
        : `<span class="badge ${statusClass}">${statusText}</span>`;

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
        <td  class="d-none d-md-table-cell">${category ? category.name : "Unknown"}</td>
        <td class="d-none d-md-table-cell">$${product.price.toFixed(2)}</td>
        <td class="d-none d-md-table-cell">$${product.discount.toFixed(2)}</td>
        <td class="d-none d-md-table-cell">${product.stock}</td>
        <td>${statusContent}</td>
        <td>
          ${!product.isDeleted ? `
            <button class="btn btn-sm btn-outline-primary rounded-circle m-1 m-md-0" onclick="openEditProductModal(${product.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger rounded-circle m-1 m-md-0" onclick="deleteProduct(${product.id})">
              <i class="fas fa-trash-alt"></i>
            </button>
          ` : `
            <button class="btn btn-sm btn-success rounded-circle m-1 m-md-0" onclick="restoreProduct(${product.id})">
              <i class="fas fa-undo"></i>
            </button>
          `}
        </td>
      `;
      tbody.appendChild(row);
    });

    // Initialize tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      new bootstrap.Tooltip(el);
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

      if (column === "categoryId") {
        const catA = CategoryManager.getCategory(a.categoryId);
        const catB = CategoryManager.getCategory(b.categoryId);
        valA = catA ? catA.name : "";
        valB = catB ? catB.name : "";
      } else if (column === "status") {
        valA = a.status || "";
        valB = b.status || "";
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
    const selectedStatus = document.getElementById("statusFilter").value;
    const currentUser = StorageManager.load("currentUser");
    const products = ProductManager.getProductsBySeller(currentUser.id);
    filteredProducts = products.filter((p) => {
      const category = CategoryManager.getCategory(p.categoryId);
      const matchesQuery =
        p.name.toLowerCase().includes(query) ||
        (category && category.name.toLowerCase().includes(query)) ||
        (p.status && p.status.toLowerCase().includes(query));
      let matchesStatus = false;
      if (selectedStatus === "all") {
        matchesStatus = true;
      } else if (selectedStatus === "deleted") {
        matchesStatus = p.isDeleted === true;
      } else {
        matchesStatus = p.status === selectedStatus && !p.isDeleted;
      }
      return matchesQuery && matchesStatus;
    });
    currentPage = 1;
    renderProductsTable();
  };

  window.filterByStatus = () => {
    const selectedStatus = document.getElementById("statusFilter").value;
    const query = document.getElementById("searchInput").value.toLowerCase();
    const currentUser = StorageManager.load("currentUser");
    const products = ProductManager.getProductsBySeller(currentUser.id);
    filteredProducts = products.filter((p) => {
      const category = CategoryManager.getCategory(p.categoryId);
      const matchesQuery =
        p.name.toLowerCase().includes(query) ||
        (category && category.name.toLowerCase().includes(query)) ||
        (p.status && p.status.toLowerCase().includes(query));
      let matchesStatus = false;
      if (selectedStatus === "all") {
        matchesStatus = true;
      } else if (selectedStatus === "deleted") {
        matchesStatus = p.isDeleted === true;
      } else {
        matchesStatus = p.status === selectedStatus && !p.isDeleted;
      }
      return matchesQuery && matchesStatus;
    });
    currentPage = 1;
    renderProductsTable();
  };

  function handleImageUpload(files, callback) {
    const imagePaths = [];
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (files && files.length) {
      Array.from(files).forEach((file) => {
        if (!validTypes.includes(file.type)) {
          showToast("Only JPEG, PNG, or GIF images are allowed.", "error");
          return;
        }
        if (file.size > maxSize) {
          showToast("Image size must be less than 5MB.", "error");
          return;
        }
        const imagePath = `/assets/images/${file.name}`;
        imagePaths.push(imagePath);
      });
    }

    callback(imagePaths);
  }

  function renderImagePreview(files, imagePaths) {
    const previewContainer = document.getElementById("imagePreview");
    previewContainer.innerHTML = "";
    const imagesToPreview = [];

    // Update selectedImages based on input
    if (files && files.length) {
      const newFiles = Array.from(files);
      // Append new files to selectedImages, avoiding duplicates
      newFiles.forEach((file) => {
        if (!selectedImages.some((img) => img.isFile && img.file.name === file.name)) {
          selectedImages.push({ src: URL.createObjectURL(file), file, isFile: true });
        }
      });
    } else if (imagePaths && imagePaths.length && selectedImages.length === 0) {
      // Only set imagePaths if selectedImages is empty (initial load for edit)
      selectedImages = imagePaths.map((image) => ({
        src: image,
        isFile: false
      }));
    }

    imagesToPreview.push(...selectedImages);

    if (imagesToPreview.length) {
      imagesToPreview.forEach(({ src }, index) => {
        const imgContainer = document.createElement("div");
        imgContainer.style.display = "inline-block";
        imgContainer.style.position = "relative";
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Preview";
        img.style.height = "100px";
        img.style.width = "100px";
        img.style.objectFit = "cover";
        img.style.margin = "5px";
        img.onerror = () => {
          img.src = "https://dummyimage.com/100x100/cccccc/000000&text=Invalid+Image";
        };
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn btn-danger btn-sm";
        removeBtn.style.position = "absolute";
        removeBtn.style.top = "0";
        removeBtn.style.right = "0";
        removeBtn.innerHTML = "×";
        removeBtn.onclick = () => {
          selectedImages.splice(index, 1);
          // Re-render with current selectedImages
          renderImagePreview(
            selectedImages.filter((img) => img.isFile).map((img) => img.file),
            selectedImages.filter((img) => !img.isFile).map((img) => img.src)
          );
          // Clear file input to prevent old files from being submitted
          document.getElementById("productImage").value = "";
        };
        imgContainer.appendChild(img);
        imgContainer.appendChild(removeBtn);
        previewContainer.appendChild(imgContainer);
      });
      previewContainer.style.display = "block";
    } else {
      previewContainer.style.display = "none";
    }
  }

  document.getElementById("productImage").addEventListener("change", (e) => {
    const files = e.target.files;
    renderImagePreview(files, null);
  });

  function populateCategorySelect() {
    const categorySelect = document.getElementById("productCategory");
    if (!categorySelect) return;
    categorySelect.innerHTML = `<option value="" disabled selected>Select category</option>`;
    const categories = CategoryManager.getAllCategories();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }

  document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("productId").value);
    const currentUser = StorageManager.load("currentUser");
    if (!currentUser || currentUser.role !== "seller") {
      showToast(
        "You must be logged in as a Seller to add/edit products.",
        "error"
      );
      window.location.href = "/index.html";
      return;
    }

    const name = document.getElementById("productName").value;
    const categoryId = parseInt(document.getElementById("productCategory").value);
    const price = parseFloat(document.getElementById("productPrice").value);
    const discount = parseFloat(document.getElementById("productDiscount").value);
    const stock = parseInt(document.getElementById("productStock").value);
    const sizes = Array.from(document.getElementById("productSizes").selectedOptions).map(option => option.value);
    const description = document.getElementById("productDescription").value;
    const brand = document.getElementById("productBrand").value;
    const sellerId = currentUser.id;

    if (isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
      showToast("Please enter valid price, stock, and category.", "error");
      return;
    }

    // Validate description and brand if provided
    if (description && (description.length < 10 || description.length > 500)) {
      showToast("Description must be between 10 and 500 characters.", "error");
      return;
    }
    if (brand && (brand.length < 2 || brand.length > 50)) {
      showToast("Brand name must be between 2 and 50 characters.", "error");
      return;
    }

    // Use selectedImages for submission
    const newFiles = selectedImages
      .filter((img) => img.isFile)
      .map((img) => img.file);
    const existingImagePaths = selectedImages
      .filter((img) => !img.isFile)
      .map((img) => img.src);

    handleImageUpload(newFiles, (newImagePaths) => {
      const finalImages = [...existingImagePaths, ...newImagePaths];

      // Check if at least one image is present
      if (finalImages.length === 0) {
        showToast("At least one image is required.", "error");
        return;
      }

      const extraOptions = {
        discount,
        status: "pending",
        sizes: sizes.length > 0 ? sizes : [],
        description: description || "",
        brand: brand || ""
      };

      if (!isNaN(id) && ProductManager.getProduct(id)) {
        ProductManager.updateProduct(
          id,
          name,
          categoryId,
          price,
          stock,
          finalImages,
          sellerId,
          extraOptions
        );
        showToast("Product updated successfully", "success");
      } else {
        const newId = Date.now();
        ProductManager.createProduct(
          newId,
          name,
          categoryId,
          price,
          stock,
          finalImages,
          sellerId,
          extraOptions
        );
        showToast("Product added successfully", "success");
      }

      filteredProducts = [...ProductManager.getProductsBySeller(currentUser.id)];
      renderProductsTable();
      bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();

      document.getElementById("productName").value = "";
      document.getElementById("productCategory").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productDiscount").value = "";
      document.getElementById("productStock").value = "";
      document.getElementById("productSizes").selectedIndex = -1;
      document.getElementById("productDescription").value = "";
      document.getElementById("productBrand").value = "";
      document.getElementById("productImage").value = "";
      selectedImages = [];
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
    document.getElementById("productSizes").selectedIndex = -1;
    document.getElementById("productDescription").value = "";
    document.getElementById("productBrand").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productImage").required = true; // Ensure required for new product
    selectedImages = [];
    populateCategorySelect();
    renderImagePreview([], []);
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
    document.getElementById("productCategory").value = product.categoryId;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productDiscount").value = product.discount;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productBrand").value = product.brand || "";
    // Populate sizes
    const sizeSelect = document.getElementById("productSizes");
    Array.from(sizeSelect.options).forEach(option => {
      option.selected = product.sizes && product.sizes.includes(option.value);
    });
    selectedImages = (product.images || []).map((image) => ({
      src: image,
      isFile: false
    }));
    // Remove required attribute if there are existing images
    document.getElementById("productImage").required = selectedImages.length === 0;
    populateCategorySelect();
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
      filteredProducts = [...ProductManager.getProductsBySeller(currentUser.id)];
      renderProductsTable();
      confirmDeleteModal.hide();
    };
  };

  // Add restore product function
  window.restoreProduct = (id) => {
    ProductManager.restoreProduct(id);
    showToast("Product restored successfully", "success");
    const currentUser = StorageManager.load("currentUser");
    filteredProducts = [...ProductManager.getProductsBySeller(currentUser.id)];
    renderProductsTable();
  };

  loadProducts();
});