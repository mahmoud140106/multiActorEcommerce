import { ProductManager } from "./productManager.js";
import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", () => {
  let filteredProducts = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";

  function loadProducts() {
    const products = ProductManager.getAllProducts();
    filteredProducts = [...products];
    renderProductsTable();
  }

  function renderProductsTable() {
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = "";
    if (filteredProducts.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="7" class="text-center">No products available</td>
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
        <td class="d-none d-md-table-cell"><img src="${
          product.images[0] ||
          "https://dummyimage.com/50x50/cccccc/000000&text=No+Img"
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
      const valA = a[column];
      const valB = b[column];

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
    const products = ProductManager.getAllProducts();
    filteredProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderProductsTable();
  };

  function handleImageUpload(files, callback) {
    const imagePaths = [];

    if (!files || files.length === 0) {
      callback([]);
      return;
    }
    Array.from(files).forEach((file) => {
      const imagePath = `/assets/images/${file.name}`;
      imagePaths.push(imagePath);
    });

    callback(imagePaths);
  }

  function renderImagePreview(files, imagePaths) {
    const previewContainer = document.getElementById("imagePreview");
    previewContainer.innerHTML = "";
    if (files && files.length) {
      Array.from(files).forEach((file) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = "Preview";
        img.style.height = "100px";
        img.style.width = "100px";
        img.style.objectFit = "cover";
        img.style.margin = "5px";
        previewContainer.appendChild(img);
      });
      previewContainer.style.display = "block";
    } else if (imagePaths && imagePaths.length) {
      imagePaths.forEach((image) => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = "Preview";
        img.style.height = "100px";
        img.style.width = "100px";
        img.style.objectFit = "cover";
        img.style.margin = "5px";
        previewContainer.appendChild(img);
      });
      previewContainer.style.display = "block";
    } else {
      previewContainer.style.display = "none";
    }
  }

  document.getElementById("productImage").addEventListener("change", (e) => {
    const files = e.target.files;
    handleImageUpload(files, (imagePaths) => {
      renderImagePreview(files, imagePaths);
    });
  });

  document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("productId").value);
    const files = document.getElementById("productImage").files;

    handleImageUpload(files, (imagePaths) => {
      const name = document.getElementById("productName").value;
      const category = document.getElementById("productCategory").value;
      const price = parseFloat(document.getElementById("productPrice").value);
      const discount = parseFloat(
        document.getElementById("productDiscount").value
      );
      const stock = parseInt(document.getElementById("productStock").value);

      if (isNaN(price) || isNaN(stock)) {
        showToast("Please enter valid price and stock.", "error");
        return;
      }

      const images = imagePaths.length
        ? imagePaths
        : ProductManager.getProduct(id)?.images || [];

      if (!isNaN(id) && ProductManager.getProduct(id)) {
        ProductManager.updateProduct(id, name, category, price, stock, images, {
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
          { discount }
        );
        showToast("Product added successfully", "success");
      }

      filteredProducts = [...ProductManager.getAllProducts()];
      renderProductsTable();
      bootstrap.Modal.getInstance(
        document.getElementById("productModal")
      ).hide();

      document.getElementById("productName").value = "";
      document.getElementById("productCategory").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productDiscount").value = "";
      document.getElementById("productStock").value = "";
      document.getElementById("productImage").value = "";
      renderImagePreview([]);
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
    renderImagePreview([]);
    new bootstrap.Modal(document.getElementById("productModal")).show();
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
      filteredProducts = [...ProductManager.getAllProducts()];
      renderProductsTable();
      confirmDeleteModal.hide();
    };
  };

  loadProducts();
});
