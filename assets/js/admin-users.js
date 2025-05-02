import { UserManager } from "../js/userManager.js"
import {StorageManager} from "../js/storageManager.js"
let userName = "";
let userEmail = "";
let userPassword = "";
let Role = "";
let userId = 0;

let tbody = document.querySelector("tbody");

const myForm = document.querySelector('form');


let CreatedTr = document.createElement("tr");
let CreatedTd1 = document.createElement("td");

let CreatedTd2 = document.createElement("td");
let CreatedTd3 = document.createElement("td");
let CreatedTd4 = document.createElement("td");
let CreatedTd5 = document.createElement("td");
let CreatedTdActions = document.createElement("td");
CreatedTdActions.innerHTML=`<i class="fa-solid fa-pen-to-square  text-primary fs-5" data-bs-toggle="modal"  data-bs-target="#myModal">`;


let currentUsers = UserManager.getAllUsers();


//Display All Users


let currentPage = 1;
const usersPerPage = 5;
// const tbody = document.querySelector("tbody");
const paginationDiv = document.getElementById("pagination");

function displayUsers(usersArray, page = 1) {
    tbody.innerHTML = ""; // Clear table
    const start = (page - 1) * usersPerPage;
    const end = start + usersPerPage;
    const usersToDisplay = usersArray.slice(start, end);

    usersToDisplay.forEach(user => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.userName}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>${user.role}</td>
            <td>
                <i class="fa-solid fa-pen-to-square text-primary fs-5" data-bs-toggle="modal" data-bs-target="#myModal"></i>
            </td>
        `;
        tbody.appendChild(tr);
    });

    setupPagination(usersArray.length, page, usersArray);
}

function setupPagination(totalUsers, currentPage, usersArray) {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    paginationDiv.innerHTML = "";

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn-dark rounded-circle mx-1";
    prevBtn.innerText = "<";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => displayUsers(usersArray, currentPage - 1));
    paginationDiv.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = `btn mx-1 rounded-circle ${i === currentPage ? "btn-dark" : "btn-outline-dark"}`;
        pageBtn.innerText = i;
        pageBtn.addEventListener("click", () => displayUsers(usersArray, i));
        paginationDiv.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-dark rounded-circle mx-1";
    nextBtn.innerText = ">";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => displayUsers(usersArray, currentPage + 1));
    paginationDiv.appendChild(nextBtn);
}



displayUsers(currentUsers); 






let searchAboutUser = document.getElementById("searchAboutUser");

searchAboutUser.addEventListener("keyup", function () {
    let searchTerm = searchAboutUser.value.toLowerCase();

   
    let filteredUsers = currentUsers.filter(user =>
        user.userName.toLowerCase().includes(searchTerm)
    );

  
    displayUsers(filteredUsers);
});



//on click on add product show empty form

document.getElementById("addUsers").addEventListener("click", function () {
    let allInputs = document.querySelectorAll('input');

    for (let index = 0; index < allInputs.length-1; index++) {
        allInputs[index].value = '';
        
    }
    
});





//remove users


//// let elementToDelete ;


//// tbody.addEventListener("click", function (e) {
//     if (e.target.classList.contains("fa-trash")) {
//         elementToDelete = e.target.closest("tr");
//         const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteAlert"));
//         modal.show();
//     }
//// });


//// document.getElementById("DeleteUser").addEventListener("click", function () {
//     if (elementToDelete) {
//         const userId = elementToDelete.querySelector("td").innerText;
//         elementToDelete.remove();
//         UserManager.deleteUser(userId);

//         const modalElement = document.getElementById("deleteAlert");
//         const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
//         modal.hide();

//         document.body.classList.remove("modal-open");
//         document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());

//         elementToDelete = null; // reset


//         let allTrs = document.getElementsByTagName('tr');
//         for (let index = 0; index < allTrs.length; index++) {
//             allTrs[index].document.querySelectorAll("td")[0] = index + 1;
            
//         }
//         for (let index = 0; index < UserManager.getAllUsers().length; index++) {
//             UserManager.getAllUsers()[index].id = index + 1;
            
//         }


//     }
//// });
// // document.getElementById("DeleteUser").addEventListener('click', function (e) {
// //         console.log(e);
// //     console.log(element.getElementsByTagName('td')[0].innerText);
        
// //     element.remove();
// //     UserManager.deleteUser(element.getElementsByTagName('td')[0].innerText);
    

// //     console.log(UserManager.getAllUsers());
    

// //     // let allTr = document.getElementsByTagName('tr');
// //     // for (let index = 0; index < allTr.length; index++) {
// //     //     allTr[index].getElementsByTagName('td')[0].innerText = index + 1;
        
// //     // }


// //     UserManager.getAllUsers();
        
// //       const modalElement = document.getElementById("deleteAlert");
// //      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
// //       modal.hide();

// //     document.body.classList.remove("modal-open");
// //     document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
        
// //     });
   


// edit user (show current data of the user in the form)


let rowIndex=null;

    
let pen = document.querySelectorAll(".fa-pen-to-square");
    
for (let index = 0; index < pen.length; index++) {
        
        pen[index].addEventListener("click", function (e) {

    // Get the index of the row
    
            

            let closeTr = this.closest('tr');
            rowIndex = Array.from(closeTr.parentElement.children).indexOf(closeTr);

            let allTds = closeTr.querySelectorAll('td');

             
            // console.log(allTds[1].innerText);
            // document.getElementById("UserID").value = allTds[0].innerText;
            document.getElementById("UserName").value = allTds[1].innerText;
            document.getElementById("staticEmail").value = allTds[2].innerText;
            document.getElementById("inputPassword").value = allTds[3].innerText;
            document.getElementById("role").value = allTds[4].innerText;
 
        })
}

    

let r;
let v = document.querySelectorAll('pen');
v.forEach(element => {
    element.addEventListener("click", function () {
        r = true;
    })
    
});


//add and update users 

document.querySelector("form").addEventListener("submit", function (e) {





    console.log(e);
    
    e.preventDefault();

    

    
     CreatedTr = document.createElement("tr");
     CreatedTd1 = document.createElement("td");

     CreatedTd2 = document.createElement("td");
     CreatedTd3 = document.createElement("td");
     CreatedTd4 = document.createElement("td");
    CreatedTd5 = document.createElement("td");
    
    //update user data

    if (rowIndex != null) {

        // console.log(rowIndex);
        
    
        let currentRow = document.getElementsByTagName("tr")[rowIndex+1];
        currentRow.querySelectorAll('td')[1].innerText = e.target[1].value;
        currentRow.querySelectorAll('td')[2].innerText = e.target[2].value;
        currentRow.querySelectorAll('td')[3].innerText = e.target[3].value;
        currentRow.querySelectorAll('td')[4].innerText = e.target[4].value;

        UserManager.updateUser(rowIndex + 1, e.target[1].value,e.target[2].value, e.target[3].value, e.target[4].value);
        rowIndex = null;

        bootstrap.Modal.getInstance(document.getElementById('myModal')).hide();
        
    }

    //add user

    else {
        let CreatedTdActions = document.createElement("td");
        CreatedTdActions.innerHTML=`<i class="fa-solid fa-pen-to-square  text-primary fs-5" data-bs-toggle="modal"  data-bs-target="#myModal"  >`;

        currentUsers = UserManager.getAllUsers();
    userId=currentUsers[currentUsers.length-1].id+1;
    userName = e.target[1].value;
    userEmail = e.target[2].value; 
    userPassword = e.target[3].value; 
    Role = e.target[4].value;
    

        
    CreatedTd1.innerText = (++userId);
    CreatedTr.appendChild(CreatedTd1);
    
    
    CreatedTd2.innerText = userName;
    CreatedTr.appendChild(CreatedTd2);
    
    
    CreatedTd3.innerText = userEmail;
    CreatedTr.appendChild(CreatedTd3);
    
    
    CreatedTd4.innerText = userPassword;
    CreatedTr.appendChild(CreatedTd4);
    
    
    CreatedTd5.innerText = Role;
    CreatedTr.appendChild(CreatedTd5);


    CreatedTr.appendChild(CreatedTdActions);

        tbody.appendChild(CreatedTr);
        

        UserManager.createUser(e.target[1].value, e.target[2].value, e.target[3].value, e.target[4].value);
        
          
        
              bootstrap.Modal.getInstance(document.getElementById('myModal')).hide();

    
    }
 
      
})

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