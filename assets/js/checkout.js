
window.addEventListener("load", function() {


    // Display the billing address form if the user selects "Different Address"
    // Hide the billing address form if the user selects "Same Address"
document.getElementById("differentAddress").addEventListener("click", function() {
    var billingAddress = document.getElementById("billingAddress");
    if (this.checked) {
        
        billingAddress.classList.remove ("d-none");
        billingAddress.classList.add ("d-block");
        document.getElementById("differentAddressDiv").style.border = "1px solid #007bff";
        document.getElementById("sameAddressDiv").style.border = "none";} 
});

document.getElementById("sameAddress").addEventListener("click", function() {
    var billingAddress = document.getElementById("billingAddress");
    if (this.checked) {
        
        billingAddress.classList.add ("d-none");
        billingAddress.classList.remove ("d-block");
        document.getElementById("sameAddressDiv").style.border = "1px solid #007bff";
        document.getElementById("differentAddressDiv").style.border = "none";
    } 
});

});//end of load event