const form = document.querySelector('.account-details form');
const paymentBtn= document.getElementById('payment-btn');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // stops reload of page
  
    
    updateSidebarName();
    updateAccountOverview();

    //can display our success bagde here (can't find it rn)
  });
  
paymentBtn.addEventListener('click',()=>{
    window.location.href = './cart.html';
});//goes to cart

  enableProfilePictureUpload();

  // to view each section accorindly
  document.querySelectorAll('.profile-list li').forEach((item, index) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.profile-list li').forEach(li => li.classList.remove('active'));
      item.classList.add('active');
  
      document.querySelectorAll('.main').forEach((section, i) => {
        if (i === index) {
          section.classList.remove('d-none');
        } else {
          section.classList.add('d-none');
        }
      });
    });
  });
  
  // update the sidebar name and pp initials
function updateSidebarName() {
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const sidebarProfileName = document.querySelector('.profile-name p');
    const profilePicContainer = document.getElementById('profile-pic-container');
  
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
  
    sidebarProfileName.innerHTML = `Hi, <br> ${firstName} ${lastName}`; 
  
    const initials = `${firstName.charAt(0).toUpperCase() || ''}${lastName.charAt(0).toUpperCase() || ''}`;
  
    // If there's a profile picture, keep it above the initials
    if (profilePicContainer.style.backgroundImage) {
      profilePicContainer.textContent = ''; // Clear text below the image
    } else {
      profilePicContainer.textContent = initials; // Add initials
    }
  }
  
  
  // to upload pp 
function enableProfilePictureUpload() {
    const profilePicInput = document.getElementById('profile-pic-input'); 
    const profilePicContainer = document.getElementById('profile-pic-container'); 
  
    // Handle file input change
    profilePicInput.addEventListener('change', (event) => {
      const file = event.target.files[0]; // Get the uploaded file
      if (file) {
        const reader = new FileReader(); // Create FileReader instance
  
        // Load the image and update the profile picture
        reader.onload = function (e) {
          profilePicContainer.style.backgroundImage = `url('${e.target.result}')`; // Set background
          profilePicContainer.textContent = ''; // Remove the default text
        };
  
        reader.readAsDataURL(file); // Read the file as a data URL
      } else {
        // Reset if no file is selected
        profilePicContainer.style.backgroundImage = ''; // Remove background image
        profilePicContainer.textContent = 'JD'; // Restore default text
      }
    });
  
    // Click event to open file input dialog
    profilePicContainer.addEventListener('click', () => {
      profilePicInput.click(); // Trigger the file input
    });
  }

  //update acc overview section
  function updateAccountOverview() {
    // Grab elements from the "My Details" section
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const dobInput = document.getElementById('dob');
    const interestedInput = document.getElementById('interested');
  
    // Grab elements in the "Account Overview" section
    const overviewName = document.querySelector('.account-overview .user-info p:nth-child(1) span');
    const overviewEmail = document.querySelector('.account-overview .user-info p:nth-child(2) span');
    const overviewDob = document.querySelector('.account-overview .subscription p:nth-child(1) span');
    const overviewInterest = document.querySelector('.account-overview .subscription p:nth-child(2) span');

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const dob = dobInput.value;
    const interest = interestedInput.value;
  
    overviewName.textContent = `${firstName} ${lastName}`;
    overviewEmail.textContent = email;
    overviewDob.textContent = dob || 'Not provided'; 
    overviewInterest.textContent = interest || 'Not specified'; 
  }
  