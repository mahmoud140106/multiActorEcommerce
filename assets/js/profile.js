import { showToast } from "./toast.js";
import { MessageManager } from "./messageManager.js";
import { StorageManager } from "./storageManager.js";
import { UserManager } from "./userManager.js";

const form = document.querySelector('.account-details form');
const paymentBtn = document.getElementById('payment-btn');

// Retrieve current user data from localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.addEventListener("DOMContentLoaded", () => {
  const storedProfile = currentUser 
    ? JSON.parse(localStorage.getItem(`userProfile_${currentUser.email}`)) 
    : null;
  
  if (storedProfile) {
    document.getElementById("first-name").value = storedProfile.firstName || "";
    document.getElementById("last-name").value = storedProfile.lastName || "";
    document.getElementById("dob").value = storedProfile.dob || "";
    
    // Set the profile picture if it exists
    const profilePicContainer = document.getElementById("profile-pic-container");
    if (storedProfile.profilePicture) {
      profilePicContainer.style.backgroundImage = `url('${storedProfile.profilePicture}')`;
      profilePicContainer.textContent = "";
    }
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
  
  // Initialize the profile picture upload functionality after loading the profile
  enableProfilePictureUpload();
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
// Assumes that you know the current user's id (for example, stored in a variable `currentUserId`)
function enableProfilePictureUpload() {
  const profilePicInput = document.getElementById("profile-pic-input");
  const profilePicContainer = document.getElementById("profile-pic-container");

  // On page load, initialize the profile picture
  if (currentUser) {
    const storedProfile = JSON.parse(localStorage.getItem(`userProfile_${currentUser.email}`));
    if (storedProfile && storedProfile.profilePicture) {
      profilePicContainer.style.backgroundImage = `url('${storedProfile.profilePicture}')`;
      profilePicContainer.textContent = "";
    } else {
      profilePicContainer.textContent = "U";
    }
  }

  profilePicInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataURL = e.target.result; // The base64 string for the image

        // Update the UI immediately
        profilePicContainer.style.backgroundImage = `url('${dataURL}')`;
        profilePicContainer.textContent = "";

        // Update the current user's profile data in localStorage
        if (currentUser) {
          const userKey = `userProfile_${currentUser.email}`;
          // Retrieve the current profile object (or initialize one) and update the profilePicture property.
          const storedProfile = JSON.parse(localStorage.getItem(userKey)) || {};
          storedProfile.profilePicture = dataURL;
          localStorage.setItem(userKey, JSON.stringify(storedProfile));
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Reset to default if no file is provided
      profilePicContainer.style.backgroundImage = "";
      profilePicContainer.textContent = "U";
      if (currentUser) {
        const userKey = `userProfile_${currentUser.email}`;
        const storedProfile = JSON.parse(localStorage.getItem(userKey)) || {};
        delete storedProfile.profilePicture;
        localStorage.setItem(userKey, JSON.stringify(storedProfile));
      }
    }
  });

  // Allow clicking on the picture container to open the file chooser
  profilePicContainer.addEventListener("click", () => {
    profilePicInput.click();
  });
  // And in your file upload callback:
profilePicInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const newProfilePicture = e.target.result;
      updateProfilePicture(newProfilePicture);
    };
    reader.readAsDataURL(file);
  }
});

}

// Example: updating the profile picture along with the profile object
function updateProfilePicture(newProfilePictureDataUrl) {
  if (!currentUser) return; // Make sure you have a logged in user

  // Retrieve the stored profile or create a new object if none found
  const storedKey = `userProfile_${currentUser.email}`;
  const storedProfile = JSON.parse(localStorage.getItem(storedKey)) || {};

  // Update the profile picture property
  storedProfile.profilePicture = newProfilePictureDataUrl;

  // Save the updated profile object
  localStorage.setItem(storedKey, JSON.stringify(storedProfile));

  // Update the UI
  const profilePicContainer = document.getElementById("profile-pic-container");
  profilePicContainer.style.backgroundImage = `url('${newProfilePictureDataUrl}')`;
  profilePicContainer.textContent = "";
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

// Message Form Submission - Save using MessageManager
document.getElementById("contact-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const subject = document.getElementById("contact-subject").value.trim();
  const type = document.getElementById("message-type").value;
  const content = document.getElementById("message-content").value.trim();

  // Validate inputs
  if (!subject) {
    showToast("Subject cannot be empty.", "error");
    return;
  }
  if (!type) {
    showToast("Please select a message type.", "error");
    return;
  }
  if (!content) {
    showToast("Message content cannot be empty.", "error");
    return;
  }

  // Find admin user to send the message to
  const users = StorageManager.load("users") || [];
  const admin = users.find(u => u.role === "admin");
  if (!admin) {
    showToast("No admin found to send message.", "error");
    return;
  }

  // Send message using MessageManager
  MessageManager.sendMessage(currentUser.id, admin.id, subject, type, content);

  showToast("Message sent successfully!", "success");
  document.getElementById("contact-subject").value = "";
  document.getElementById("message-type").value = "";
  document.getElementById("message-content").value = "";
  loadMessages(); // Refresh message history
});

// Load messages in customer profile
function loadMessages() {
  const messages = MessageManager.getMessagesForUser(currentUser.id);
  const users = StorageManager.load("users") || [];
  const admin = users.find(u => u.role === "admin");
  const adminId = admin ? admin.id : null;
  const messageList = document.querySelector(".message-list");
  messageList.innerHTML = "";

  const filteredMessages = messages.filter(message => 
    message.recipientId === currentUser.id || 
    (message.senderId === currentUser.id && message.recipientId === adminId)
  );

  if (filteredMessages.length === 0) {
    messageList.innerHTML = '<p class="text-muted">No messages available.</p>';
    return;
  }

  filteredMessages.forEach((msg) => {
    const senderName = msg.senderId === currentUser.id ? "You" : "Admin";
    const messageItem = `
      <div class="message-item">
        <div class="message-header">
          <h4>${msg.type}: ${msg.subject}</h4>
          <span class="message-date">${new Date(msg.timestamp).toLocaleString()}</span>
        </div>
        <p><strong>Sender:</strong> ${senderName}</p>
        <p><strong>Message:</strong> ${msg.content}</p>
      </div>`;
    messageList.innerHTML += messageItem;
  });
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