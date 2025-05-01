let userName = "";
let userEmail = "";
let userPassword = "";
let Role = "";
let userId = 0;


document.getElementById("addUsers").addEventListener("click", function () {
    let allInputs = document.querySelectorAll('input');

    for (let index = 0; index < allInputs.length-1; index++) {
        allInputs[index].value = '';
        
    }
    
});



//add and update users 

document.querySelector("form").addEventListener("submit", function (e) {

    e.preventDefault();

    let tbody=document.querySelector("tbody");
    let CreatedTr = document.createElement("tr");
    let CreatedTd1 = document.createElement("td");

    let CreatedTd2 = document.createElement("td");
    let CreatedTd3 = document.createElement("td");
    let CreatedTd4 = document.createElement("td");
    let CreatedTd5 = document.createElement("td");

    if (e.target[0].value) {

        //update data of users


        let rowNum = e.target[0].value;
        // console.log(rowNum);
        
        
        let currentRow = document.getElementsByTagName("tr")[rowNum];
        
        // console.log(currentRow);
        

        // console.log(e.target[1].value);
        // console.log(currentRow.querySelectorAll('td')[1].innerText);
        
        

        currentRow.querySelectorAll('td')[1].innerText = e.target[1].value;
        currentRow.querySelectorAll('td')[2].innerText = e.target[2].value;
        currentRow.querySelectorAll('td')[3].innerText = e.target[3].value;
        currentRow.querySelectorAll('td')[4].innerText = e.target[4].value;
       

        
    }

    else {

        // add users 

        userName = e.target[1].value;
    userEmail = e.target[2].value; 
    userPassword = e.target[2].value; 
    Role = e.target[4].value;
    userId++;

    console.log(userName);
    



    
    CreatedTd1.innerText = userId;
    CreatedTr.appendChild(CreatedTd1);
    
    
    CreatedTd2.innerText = userName;
    CreatedTr.appendChild(CreatedTd2);
    
    
    CreatedTd3.innerText = userEmail;
    CreatedTr.appendChild(CreatedTd3);
    
    
    CreatedTd4.innerText = userPassword;
    CreatedTr.appendChild(CreatedTd4);
    
    
    CreatedTd5.innerText = Role;
    CreatedTr.appendChild(CreatedTd5);
    // console.log(CreatedTr);

    let CreatedTdActions = document.createElement("td");
    CreatedTdActions.innerHTML = `<i class="fa-solid fa-pen-to-square   text-primary fs-5" data-bs-toggle="modal"  data-bs-target="#myModal"  data-bs-dismiss="modal"></i>  <i class="fa-solid fa-trash  text-danger fs-5" data-bs-toggle="modal" data-bs-target="#deleteAlert"></i>`;
    CreatedTr.appendChild(CreatedTdActions);

    tbody.appendChild(CreatedTr);
        
  
        


    }




    //remove users

    
    let element = '';
let allTrash = document.querySelectorAll(".fa-trash");
for (let index = 0; index < allTrash.length; index++) {
    allTrash[index].addEventListener("click", function (e) {

        element=this.closest('tr')
       
    //     console.log(e);
        
    //    let result=confirm("sure");
    //    if (result) {
    //         this.closest('tr').remove();         
    //    }
       
})
    
    }



    
    document.getElementById("DeleteUser").addEventListener('click', function (e) {
        element.remove();
      const modalElement = document.getElementById("deleteAlert");
     const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();

    document.body.classList.remove("modal-open"); 
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
        
    });
    
    





    // edit user (show current data of the user in the form)

    
    let pen = document.querySelectorAll(".fa-pen-to-square");
    
    for (let index = 0; index < pen.length; index++) {
        
        pen[index].addEventListener("click", function (e) {

            let closeTr = this.closest('tr');
            let allTds = closeTr.querySelectorAll('td');
            console.log(allTds[1].innerText);
            document.getElementById("UserID").value = allTds[0].innerText;
            document.getElementById("UserName").value = allTds[1].innerText;
            document.getElementById("staticEmail").value = allTds[2].innerText;
            document.getElementById("inputPassword").value = allTds[3].innerText;
            document.getElementById("role").value = allTds[4].innerText;
 
        })
    }
    
    
      
})




