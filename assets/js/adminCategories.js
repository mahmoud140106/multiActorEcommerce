import { CategoryManager } from "./categoryManager.js";
import { showToast } from "./toast.js";

const elements = {
    form: document.getElementById("categoryForm"),
    tableBody: document.getElementById("categoriesTableBody"),
    searchInput: document.getElementById("searchCategory"),
    modal: document.getElementById("categoryModal"),
    deleteModal: document.getElementById("deleteModal"),
    idInput: document.getElementById("categoryId"),
    nameInput: document.getElementById("categoryName"),
    confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
    modalTitle: document.getElementById("categoryModalLabel")
};

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    setupEventListeners();
});

function setupEventListeners() {
    elements.form.addEventListener("submit", handleFormSubmit);
    elements.searchInput.addEventListener("input", searchCategories);
    elements.confirmDeleteBtn.addEventListener("click", deleteCategory);
}

function loadCategories() {
    const categories = CategoryManager.getAllCategories();
    elements.tableBody.innerHTML = "";

    if (categories.length === 0) {
        elements.tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No categories found</td></tr>`;
        return;
    }

    categories.forEach(category => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td><span class="badge bg-success">Active</span></td> <!-- Status always "Active" -->
            <td>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${category.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${category.id}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        elements.tableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => btn.addEventListener("click", loadCategoryForEdit));
    document.querySelectorAll(".delete-btn").forEach(btn => btn.addEventListener("click", confirmDelete));
}

function handleFormSubmit(event) {
    event.preventDefault();

    const id = elements.idInput.value ? parseInt(elements.idInput.value) : Date.now();
    const name = elements.nameInput.value.trim();

    if (!name) {
        showToast("Please enter a category name.", "error");
        return;
    }

    if (elements.idInput.value) {
        CategoryManager.updateCategory(id, name);
        showToast("Category updated successfully!", "success");
    } else {
        CategoryManager.createCategory(id, name);
        showToast("Category added successfully!", "success");
    }

    console.log("Updated categories:", CategoryManager.getAllCategories()); // Debugging step
    resetForm();
    loadCategories();
    bootstrap.Modal.getInstance(elements.modal)?.hide();
}

function loadCategoryForEdit(event) {
    const categoryId = parseInt(event.currentTarget.dataset.id);
    const category = CategoryManager.getCategory(categoryId);

    if (category) {
        elements.idInput.value = category.id;
        elements.nameInput.value = category.name;
        elements.modalTitle.textContent = `Edit ${category.name}`;
        bootstrap.Modal.getInstance(elements.modal)?.show();
    }
}

function confirmDelete(event) {
    const categoryId = event.currentTarget.dataset.id;
    elements.confirmDeleteBtn.dataset.id = categoryId;
}

function deleteCategory() {
    const categoryId = elements.confirmDeleteBtn.getAttribute('data-id');

    try {
        CategoryManager.deleteCategory(parseInt(categoryId));
        showToast("Category deleted successfully!", "success");

        // Remove the row dynamically without refreshing
        document.querySelector(`.delete-btn[data-id="${categoryId}"]`).closest("tr").remove();

        bootstrap.Modal.getInstance(elements.deleteModal)?.hide();
    } catch (error) {
        console.error("Error deleting category:", error);
        showToast("Failed to delete category.", "error");
    }
}

function searchCategories() {
    const query = elements.searchInput.value.toLowerCase().trim();
    const allCategories = CategoryManager.getAllCategories();

    if (!query) {
        loadCategories();
        return;
    }

    const filteredCategories = allCategories.filter(category => category.name.toLowerCase().includes(query));

    elements.tableBody.innerHTML = "";

    if (filteredCategories.length === 0) {
        elements.tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-4">No matching categories found</td></tr>`;
        return;
    }

    filteredCategories.forEach(category => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${category.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${category.id}" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        elements.tableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => btn.addEventListener("click", loadCategoryForEdit));
}

function resetForm() {
    elements.form.reset();
    elements.idInput.value = "";
    elements.modalTitle.textContent = "Add New Category";
}
