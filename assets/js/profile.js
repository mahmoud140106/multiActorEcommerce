import { showToast } from "./toast.js";

const form = document.querySelector('.account-details form');
const paymentBtn = document.getElementById('payment-btn');

// Retrieve current user data from localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.addEventListener("DOMContentLoaded", () => {
  const storedProfile = currentUser 
    ? JSON.parse(localStorage.getItem(`userProfile_${currentUser.email}`)) 
    : null;
  
  if (storedProfile) {
    document.getElementById("first-name").value = storedProfile.firstName;
    document.getElementById("last-name").value = storedProfile.lastName;
    document.getElementById("dob").value = storedProfile.dob;
  }
  
  if (currentUser) {
    const userNameInput = document.getElementById("user-name");
    userNameInput.value = currentUser.userName;
    userNameInput.readOnly = true;

    const emailInput = document.getElementById("email");
    emailInput.value = currentUser.email;
    emailInput.readOnly = true;

    updateSidebarName();
  } else {
    console.warn("No logged-in user found.");
  }
});


// Handle form submission (prevent page reload and update the sidebar / account overview)
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevents page reload

  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const dob = document.getElementById('dob').value.trim();

  // Validate that all fields are filled
  if (!firstName || !lastName || !dob) {
    showToast('Please fill in all fields before saving!', 'error');
    return;
  }

  // Save form data to localStorage
  const userProfile = {
    firstName,
    lastName,
    dob
  };
  if (currentUser && currentUser.email) {
    localStorage.setItem(`userProfile_${currentUser.email}`, JSON.stringify(userProfile));
  }  
  

  updateSidebarName();
  checkBirthday();

  showToast('Profile updated successfully!', 'success');
});


// Payment button: redirect user to the cart page
paymentBtn.addEventListener('click', () => {
  window.location.href = './cart.html';
});

// Toggle visibility of each profile section based on the clicked list item
document.querySelectorAll('.profile-list li').forEach((item, index) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.profile-list li').forEach(li => li.classList.remove('active'));
    item.classList.add('active');

    document.querySelectorAll('.main').forEach((section, i) => {
      section.classList.toggle('d-none', i !== index);
    });
  });
});

// Update the sidebar greeting with first name only or first & last name if available, otherwise fallback to the current user's username.
function updateSidebarName() {
  // Retrieve the current user's profile data using a unique key
  const storedProfile = currentUser 
    ? JSON.parse(localStorage.getItem(`userProfile_${currentUser.email}`))
    : null;

  const storedFirstName = storedProfile ? storedProfile.firstName : "";
  const storedLastName = storedProfile ? storedProfile.lastName : "";

  let displayName = "";
  if (storedFirstName && storedLastName) {
    displayName = `${storedFirstName} ${storedLastName}`;
  } else if (storedFirstName) {
    displayName = storedFirstName;
  } else if (currentUser && currentUser.userName) {
    displayName = currentUser.userName;
  } else {
    displayName = "User";
  }

  document.querySelector(".profile-name p").innerHTML = `Hi, <br> ${displayName}`;

  const profilePicContainer = document.getElementById('profile-pic-container');
  let initials = "";
  if (storedFirstName && storedLastName) {
    initials = storedFirstName.charAt(0) + storedLastName.charAt(0);
  } else if (storedFirstName) {
    initials = storedFirstName.charAt(0);
  } else if (currentUser && currentUser.userName) {
    initials = currentUser.userName.charAt(0);
  } else {
    initials = "U";
  }
  
  if (!profilePicContainer.style.backgroundImage) {
    profilePicContainer.textContent = initials.toUpperCase();
  }
}


// Enable profile picture upload functionality
function enableProfilePictureUpload() {
  const profilePicInput = document.getElementById('profile-pic-input');
  const profilePicContainer = document.getElementById('profile-pic-container');

  profilePicInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
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

  profilePicContainer.addEventListener('click', () => {
    profilePicInput.click();
  });
}

// Birthday check: if today's the user's birthday, show a message.
function checkBirthday() {
  const dobInput = document.getElementById('dob');
  const birthdayMessage = document.getElementById('birthday-message');

  if (!dobInput.value) return;

  const today = new Date();
  const dob = new Date(dobInput.value);

  if (dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()) {
    birthdayMessage.textContent = "🎉 Happy Birthday! Order now and receive a gift with your order. 🎁";
    birthdayMessage.style.display = "block";
  } else {
    birthdayMessage.style.display = "none";
  }
}

enableProfilePictureUpload();

// Message Form Submission - Save to Local Storage
document.getElementById("contact-form").addEventListener("submit", function(event) {
  event.preventDefault();

  let subject = document.getElementById("contact-subject").value;
  let type = document.getElementById("message-type").value;
  let content = document.getElementById("message-content").value;

  let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];

  let newMessage = {
      id: Date.now(),
      subject,
      type,
      content,
      userEmail: currentUser?.email || "Anonymous",
      timestamp: new Date().toLocaleString(),
      status: "Open",
      reply: ""
  };

  messages.push(newMessage);
  localStorage.setItem("customerMessages", JSON.stringify(messages));

  showToast("Message sent successfully!", "success");
  loadMessages(); // Refresh message history
});

// Load messages in customer profile
function loadMessages() {
  let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
  let messageList = document.querySelector(".message-list");
  messageList.innerHTML = ""; 

  messages.forEach((msg) => {
      let messageItem = `
          <div class="message-item">
              <div class="message-header">
                  <h4>${msg.type}: ${msg.subject}</h4>
                  <span class="message-date">${msg.timestamp}</span>
              </div>
              <p><strong>Your Message:</strong> ${msg.content}</p>
              <p><strong>Admin Reply:</strong> ${msg.reply ? msg.reply : "No reply yet"}</p>
              <div class="message-status">
                  <span class="status-badge ${msg.status === 'Open' ? 'status-open' : 'status-responded'}">
                      ${msg.status}
                  </span>
              </div>
          </div>`;
      messageList.innerHTML += messageItem;
  });
}

// Delete messages from Local Storage
function deleteMessage(index) {
  let messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
  messages.splice(index, 1);
  localStorage.setItem("customerMessages", JSON.stringify(messages));
  loadMessages(); // Refresh message list
}

window.onload = loadMessages;


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
