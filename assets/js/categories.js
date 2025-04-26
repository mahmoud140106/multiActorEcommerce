import { Category, CategoryManager, initializeDefaultCategories } from './categoryManager.js';

let currentPage = 1; 
const itemsPerPage = 6;

function appendCategories() {
    const container = document.getElementById('category-body');
  
    const categories = CategoryManager.getAllCategories();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = categories.slice(startIndex, endIndex);

    let row = document.createElement('div');
    row.className = 'row myrow'; // 1st row

    paginatedCategories.forEach((category, index) => {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card">
        <div class="card-cover">
          <div class="blur-background"></div>
          <h1 class="cover-text">${category.name}</h1>
        </div>
        <img src="${category.image}" class="card-img-top" alt="${category.name}">
      </div>
    `;

    row.appendChild(col); // append the stuff to a col and the cols inside the row

    // after 3 items append the row to the container and make a new row
    if ((index + 1) % 3 === 0) {
      container.appendChild(row);
      row = document.createElement('div');
      row.className = 'row myrow'; // make a new row
    }
  });

    // append the last row if it contains any columns
    if (row.children.length > 0) {
        container.appendChild(row);
    }

  updatePagination(categories.length);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.querySelector('.pagination.pages');

    pagination.innerHTML = ''; 

    // prev page
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
    prevLi.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            appendCategories();
        }
    });
    pagination.appendChild(prevLi);

    // page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', () => {
            currentPage = i;
            appendCategories();
        });
        pagination.appendChild(pageLi);
    }

    // next btn
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
    nextLi.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            appendCategories();
        }
    });
    pagination.appendChild(nextLi);
  }

window.onload = function () {
    initializeDefaultCategories(); 
    appendCategories();
};