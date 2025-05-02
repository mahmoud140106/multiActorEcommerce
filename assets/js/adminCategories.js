import { CategoryManager } from "./categoryManager.js";
import { showToast } from "./toast.js";

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let sortColumn = "id";
let sortDirection = "asc";
let categories = [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let selectedImage = null; // Store single selected image (file or path)

function loadCategories() {
  categories = CategoryManager.getAllCategories();
  renderCategories();
}

function renderCategories() {
  const searchTerm = document.getElementById("searchCategory").value.toLowerCase();
  let filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm)
  );

  filteredCategories.sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];
    if (sortColumn === "name") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (sortDirection === "asc") {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedCategories = filteredCategories.slice(start, end);

  const tbody = document.getElementById("categoriesTableBody");
  tbody.innerHTML = "";
  if (paginatedCategories.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="4" class="text-center">No categories available</td>
    `;
    tbody.appendChild(row);
    return;
  }

  paginatedCategories.forEach((category) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td>
        <img src="${category.image || 'https://dummyimage.com/50x50/cccccc/000000&text=No+Img'}" 
             alt="${category.name}" 
             style="width: 50px; height: 50px; object-fit: cover;" 
             onerror="this.src='https://dummyimage.com/50x50/cccccc/000000&text=No+Img';">
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary rounded-circle m-1" onclick="openEditCategoryModal(${category.id})" data-bs-toggle="modal" data-bs-target="#categoryModal">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger rounded-circle m-1" onclick="openDeleteCategoryModal(${category.id})" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  renderPagination(filteredCategories.length);
}

function renderPagination(totalItems) {
  const pageCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

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

function sortTable(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortColumn = column;
    sortDirection = "asc";
  }

  document.querySelectorAll("thead span").forEach((span) => (span.innerHTML = ""));
  document.getElementById(`sort-${column}`).innerHTML =
    sortDirection === "asc" ? "↑" : "↓";

  renderCategories();
}

function handleImageUpload(file, callback) {
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (file) {
    if (!validTypes.includes(file.type)) {
      showToast("Only JPEG, PNG, or GIF images are allowed.", "error");
      return;
    }
    if (file.size > maxSize) {
      showToast("Image size must be less than 5MB.", "error");
      return;
    }
    const imagePath = `/assets/images/${file.name}`;
    callback(imagePath);
  } else {
    callback(null);
  }
}

function renderImagePreview(file, existingImage) {
  const previewContainer = document.getElementById("imagePreview");
  previewContainer.innerHTML = "";
  let imageToPreview = null;

  if (file) {
    selectedImage = { src: URL.createObjectURL(file), file, isFile: true };
  } else if (existingImage && !selectedImage) {
    selectedImage = { src: existingImage, isFile: false };
  }

  imageToPreview = selectedImage;

  if (imageToPreview) {
    const imgContainer = document.createElement("div");
    imgContainer.style.display = "inline-block";
    imgContainer.style.position = "relative";
    const img = document.createElement("img");
    img.src = imageToPreview.src;
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
      selectedImage = null;
      renderImagePreview(null, null);
      document.getElementById("categoryImage").value = "";
    };
    imgContainer.appendChild(img);
    imgContainer.appendChild(removeBtn);
    previewContainer.appendChild(imgContainer);
    previewContainer.style.display = "block";
  } else {
    previewContainer.style.display = "none";
  }
}

function openAddCategoryModal() {
  document.getElementById("categoryModalLabel").textContent = "Add Category";
  document.getElementById("categoryForm").reset();
  document.getElementById("categoryId").value = "";
  document.getElementById("categoryImage").required = true;
  selectedImage = null;
  renderImagePreview(null, null);
}

function openEditCategoryModal(id) {
  const category = CategoryManager.getCategory(id);
  if (category) {
    document.getElementById("categoryModalLabel").textContent = "Edit Category";
    document.getElementById("categoryId").value = category.id;
    document.getElementById("categoryName").value = category.name;
    selectedImage = { src: category.image, isFile: false };
    document.getElementById("categoryImage").required = false;
    renderImagePreview(null, category.image);
    new bootstrap.Modal(document.getElementById("categoryModal")).show();
  }
}

function openDeleteCategoryModal(id) {
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.onclick = () => deleteCategory(id);
  new bootstrap.Modal(document.getElementById("confirmDeleteModal")).show();
}

function deleteCategory(id) {
  const hasProducts = products.some((product) => product.categoryId === id);
  if (hasProducts) {
    showToast(
      "Cannot delete category. There are products associated with it.",
      "error"
    );
    bootstrap.Modal.getInstance(
      document.getElementById("confirmDeleteModal")
    ).hide();
    return;
  }

  CategoryManager.deleteCategory(id);
  showToast("Category deleted successfully!", "success");
  bootstrap.Modal.getInstance(
    document.getElementById("confirmDeleteModal")
  ).hide();
  loadCategories();
}

document.getElementById("categoryImage").addEventListener("change", (e) => {
  const file = e.target.files[0];
  renderImagePreview(file, null);
});

document.getElementById("categoryForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("categoryId").value;
  const name = document.getElementById("categoryName").value;
  const file = selectedImage && selectedImage.isFile ? selectedImage.file : null;
  const existingImage = selectedImage && !selectedImage.isFile ? selectedImage.src : null;

  if (!name) {
    showToast("Category name is required.", "error");
    return;
  }

  if (!file && !existingImage) {
    showToast("A category image is required.", "error");
    return;
  }

  handleImageUpload(file, (imagePath) => {
    const finalImage = imagePath || existingImage;

    if (id) {
      CategoryManager.updateCategory(parseInt(id), name, finalImage);
      showToast("Category updated successfully!", "success");
    } else {
      const newId = categories.length
        ? Math.max(...categories.map((c) => c.id)) + 1
        : 1;
      CategoryManager.createCategory(newId, name, finalImage);
      showToast("Category added successfully!", "success");
    }

    bootstrap.Modal.getInstance(document.getElementById("categoryModal")).hide();
    selectedImage = null;
    window.location.reload();
    loadCategories();
  });
});

document.getElementById("searchCategory").addEventListener("keyup", () => {
  currentPage = 1;
  renderCategories();
});

window.changePage = (page) => {
  if (page < 1 || page > Math.ceil(categories.length / ITEMS_PER_PAGE)) return;
  currentPage = page;
  renderCategories();
};

window.sortTable = sortTable;
window.openAddCategoryModal = openAddCategoryModal;
window.openEditCategoryModal = openEditCategoryModal;
window.openDeleteCategoryModal = openDeleteCategoryModal;

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});

document.addEventListener("DOMContentLoaded", function () {
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
});