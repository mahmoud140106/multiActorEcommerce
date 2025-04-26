import { UserManager } from "./userManager.js";
import { StorageManager } from "./storageManager.js";
import { showToast } from "./toast.js";
import { updateNavbar } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      login(email, password);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userName = document.getElementById("signup-userName").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const role = document.querySelector('input[name="role"]:checked')?.value || "customer";
      signup(userName, email, password, role);
    });
  }
});

function login(email, password) {
  const user = UserManager.getUserByEmail(email);
  if (user && user.password === password) {
    StorageManager.save("currentUser", user);
    showToast("Login successful!", "success");
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    updateNavbar();
    if (user.role === "admin") {
      window.location.href = "/admin/dashboard.html";
    } else if (user.role === "seller") {
      window.location.href = "/seller/dashboard.html";
    } else {
      window.location.href = "/index.html";
    }
  } else {
    showToast("Invalid email or password.", "error");
  }
}

function signup(userName, email, password, role) {
  try {
    UserManager.createUser(userName, email, password, role);
    showToast("Sign up successful! Please log in.", "success");
    bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
    document.getElementById("signup-userName").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
    document.querySelector('input[name="role"][value="customer"]').checked = true;
    openLoginModal(email);
  } catch (error) {
    showToast(error.message, "error");
  }
}

window.openLoginModal = (email = "") => {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  if (email) {
    document.getElementById("login-email").value = email;
  }
  loginModal.show();
};

window.openSignupModal = () => {
  new bootstrap.Modal(document.getElementById("signupModal")).show();
};

window.logout = () => {
  StorageManager.remove("currentUser");
  showToast("Logged out successfully!", "success");
  updateNavbar();
  window.location.href = "/index.html";
};