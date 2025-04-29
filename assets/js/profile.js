const form = document.querySelector('.account-details form');
const paymentBtn = document.getElementById('payment-btn');

// Handle form submission (prevent page reload and update sidebar/account overview)
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stops page reload

  updateSidebarName();
  // updateAccountOverview();
  checkBirthday();
  // display our success toast here if needed
});

// Payment button: redirect user to the cart page
paymentBtn.addEventListener('click', () => {
  window.location.href = './cart.html';
});

// Enable profile picture upload functionality
enableProfilePictureUpload();

// Toggle visibility of each profile section based on the clicked list item
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

// Update the sidebar name and profile picture initials
function updateSidebarName() {
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const sidebarProfileName = document.querySelector('.profile-name p');
  const profilePicContainer = document.getElementById('profile-pic-container');

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  
  // Update greeting
  sidebarProfileName.innerHTML = `Hi, <br> ${firstName} ${lastName}`;

  // Generate initials from first and last name
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

  // If a profile picture is set, keep it; otherwise, show initials.
  if (profilePicContainer.style.backgroundImage) {
    profilePicContainer.textContent = ''; // Clear text if an image exists
  } else {
    profilePicContainer.textContent = initials;
  }
}


// Enable profile picture upload functionality
function enableProfilePictureUpload() {
  const profilePicInput = document.getElementById('profile-pic-input');
  const profilePicContainer = document.getElementById('profile-pic-container');

  profilePicInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePicContainer.style.backgroundImage = `url('${e.target.result}')`;
        profilePicContainer.textContent = ''; 
      };
      reader.readAsDataURL(file);
    } else {
      profilePicContainer.style.backgroundImage = '';
      profilePicContainer.textContent = 'U'; 
    }
  });

  // When the profile picture container is clicked, open the file dialog
  profilePicContainer.addEventListener('click', () => {
    profilePicInput.click();
  });
}
function checkBirthday() {
  const dobInput = document.getElementById('dob');
  const birthdayMessage = document.getElementById('birthday-message');

  if (!dobInput.value) return; // Exit if no DOB is entered

  const today = new Date();
  const dob = new Date(dobInput.value);

  if (dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()) {
    birthdayMessage.textContent = "🎉 Happy Birthday! Order now and receive a gift with your order. 🎁";
    birthdayMessage.style.display = "block";
  } else {
    birthdayMessage.style.display = "none";
  }
}

// Update the "Account Overview" section using data from the "My Details" section
// function updateAccountOverview() {
//   // Use the new "user-name" input instead of first-name/last-name inputs
//   const userNameInput = document.getElementById('user-name');
//   const emailInput = document.getElementById('email');

//   // Grab the overview display elements (adjust selectors if necessary)
//   const overviewName = document.querySelector('.account-overview .user-info p:nth-child(1) span');
//   const overviewEmail = document.querySelector('.account-overview .user-info p:nth-child(2) span');

//   const userName = userNameInput.value.trim();
//   const email = emailInput.value.trim();

//   // Update the Account Overview section with the new values
//   overviewName.textContent = userName;
//   overviewEmail.textContent = email;
// }
