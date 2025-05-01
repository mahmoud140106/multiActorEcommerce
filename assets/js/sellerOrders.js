import { StorageManager } from "./storageManager.js";
import { OrderManager } from "./orderManager.js";
import { showToast } from "./toast.js";
import { UserManager } from "./userManager.js";

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

  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  let sellerOrders =[];
  let filteredOrders;
  // get products for each seller 

  loadOrders();
  function loadOrders() {
    const currentUser = StorageManager.load("currentUser");
    if (!currentUser || currentUser.role !== "seller") {
      showToast(
        "You must be logged in as a Seller to view Orders.",
        "error"
      );
      window.location.href = "/index.html";
      return;
    }
    let allOrders = OrderManager.getAllOrders()              //get all orders
    console.log(allOrders)

    let products = StorageManager.load('products');         //get all products to get products for each seller by seller id
    allOrders.forEach((order)=>
    {

        order.items.forEach((item)=>{
        console.log(item)
            let productFromStorage=products.find(product=>product.id===item.productId)    //filter products from storage to get seller id
           console.log(productFromStorage)
            if(productFromStorage.sellerId==currentUser.id && productFromStorage.id==item.productId){
                sellerOrders.push(order);         //filter all orders to get the seller orders
                
            }
        })
    })
    // console.log(sellerOrders)
    renderOrdersTable();
  }

  function renderOrdersTable() {
    const tbody = document.getElementById("ordersTableBody");
    tbody.innerHTML = "";
  
    const ordersToRender = filteredOrders ?? sellerOrders;
  
    if (ordersToRender.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="9" class="text-center">No Orders available</td>
      `;
      tbody.appendChild(row);
      return;
    }
  
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedOrders = ordersToRender.slice(start, end);
  
    paginatedOrders.forEach((order,index) => {
      const statusClass = order.status === "pending" ? "bg-warning text-dark" :
                          order.status === "accepted" ? "bg-success text-white" :
                          order.status === "Shipped" ? "bg-success text-white" :
                          order.status === "rejected" ? "bg-danger text-white" : "bg-secondary text-white";
      const statusText = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown";
      const statusContent = order.status === "rejected" && order.rejectReason
        ? `<span class="badge ${statusClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${order.rejectReason}">${statusText}</span>`
        : `<span id='orderCurrentStatus${index}' class="badge ${statusClass}">${statusText}</span>`;
  
      const row = document.createElement("tr");
      row.setAttribute('orderId',`${order.id}`);
      row.innerHTML = `
        <td>...${order.id % 1000}</td>
        <td>${UserManager.getUserNameById(order.customerId)}</td>
        <td class="d-none d-md-table-cell">$${order.createdAt}</td>
        <td class="d-none d-md-table-cell">$${order.total.toFixed(2)}</td>
        <td >${statusContent}</td>
        <td> 
            <select class="form-control orderNewStatus" >
                       <option value='action' >Action</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="shipped">Shipped</option>
                        <option value="rejected">Rejected</option>
            </select>
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
    const pageCount = Math.ceil((filteredOrders ?? sellerOrders).length / itemsPerPage);

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
    if (page < 1 || page > Math.ceil(sellerOrders.length / itemsPerPage))
      return;
    currentPage = page;
    renderOrdersTable();
  };

  window.sortTable = (column) => {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }

    sellerOrders.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

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
    renderOrdersTable();
  };

  window.searchOrders = () => {
    console.log('from search')
    const query = document.getElementById("searchInput").value.toLowerCase();
    const selectedStatus = document.getElementById("statusFilter").value;
    filteredOrders = sellerOrders.filter((o) => {
      const matchesQuery =
      (UserManager.getUserNameById(o.customerId)).toLowerCase().includes(query) ||
        (o.status && o.status.toLowerCase().includes(query));
      const matchesStatus = selectedStatus === "all" || o.status === selectedStatus;
      return matchesQuery && matchesStatus;
    });
    currentPage = 1;
    renderOrdersTable();
  };

  //filter by status
document.getElementById('statusFilter').addEventListener('change',function(){

    const selectedStatus = document.getElementById("statusFilter").value;
    console.log(selectedStatus)
    const query = document.getElementById("searchInput").value.toLowerCase();
    filteredOrders = sellerOrders.filter((o) => {
      const matchesQuery =
      (UserManager.getUserNameById(o.customerId)).toLowerCase().includes(query) ||
        (o.status && o.status.toLowerCase().includes(query));
      const matchesStatus = selectedStatus === "all" || o.status === selectedStatus;
      return matchesQuery && matchesStatus;
    });
    currentPage = 1;
    renderOrdersTable();
  });

 //add event listener to each row(order) in seller orders to show order details
   document.querySelectorAll('tr').forEach((row)=>{
    row.addEventListener('click',function(e){
        const clickedCell = e.target.closest("td");
        const lastCell = row.querySelector("td:last-child");
      
        if (clickedCell === lastCell) {
          // Don't trigger the action for the last cell
          return;
        }
        let orderId=row.getAttribute('orderId');
        window.location.href=`orderDetails.html?orderId=${orderId}`;
    })
 })


 //change the status of the order
 document.querySelectorAll('.orderNewStatus').forEach((action,index)=>{
   action.addEventListener('change',function(e){
        let orderCurrentStatus=document.getElementById(`orderCurrentStatus${index}`);
        const statusClasses = {
            pending: "bg-warning text-dark",
            accepted: "bg-success text-white",
            shipped: "bg-secondary text-white",
            rejected: "bg-danger text-white" ,
             
          };
    
        orderCurrentStatus.className=`badge ${statusClasses[e.target.value]}`;
        orderCurrentStatus.innerText=e.target.value
      
    
     })
     
 })
 

}) // end of load
