import { Category, CategoryManager } from "./categoryManager.js";

let currentPage = 1;
const itemsPerPage = 8;

function appendCategories() {
  const container = document.getElementById("category-body");
  const categories = CategoryManager.getAllCategories();
  // console.log(categories)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);
  
  container.innerHTML = "";
  let row;
  
  paginatedCategories.forEach((category, index) => {
    if (index % 4 === 0) {
      // Create new row every 4 items
      row = document.createElement("div");
      row.className = "row myrow";
      container.appendChild(row);
    }

    const col = document.createElement("div");
    col.className = "col-6 col-sm-6 col-md-3";
    col.innerHTML = `
          <div class="card">
            <div class="card-cover">
              <div class="blur-background" style="background-image: url(${category.image});"></div>
              <h1 class="cover-text">${category.name}</h1>
            </div>
            <img src="${category.image}" class="card-img-top" alt="${category.name}" loading="lazy">
          </div>
        `;

    row.appendChild(col);
  });

  updatePagination(categories.length);
}

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.querySelector(".pagination.pages");

  pagination.innerHTML = "";

  // prev page
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
  prevLi.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      appendCategories();
    }
  });
  pagination.appendChild(prevLi);

  // page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement("li");
    pageLi.className = `page-item ${i === currentPage ? "active" : ""}`;
    pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageLi.addEventListener("click", () => {
      currentPage = i;
      appendCategories();
    });
    pagination.appendChild(pageLi);
  }

  // next btn
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  nextLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
  nextLi.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      appendCategories();
    }
  });
  pagination.appendChild(nextLi);
}

document.addEventListener("DOMContentLoaded", () => {
  appendCategories();
});
