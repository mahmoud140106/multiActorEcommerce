import { UserManager } from "./userManager.js";
import { StorageManager } from "./storageManager.js";
import { showToast } from "./toast.js";
import { updateNavbar } from "./global.js";

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const minLength = 8;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return password.length >= minLength && passwordRegex.test(password);
}

function validateUserName(userName) {
  const userNameRegex = /^[a-zA-Z0-9_-]{3,}$/;
  return userNameRegex.test(userName);
}

function showError(fieldId, message) {
  const errorDiv = document.getElementById(`${fieldId}-error`);
  errorDiv.textContent = message;
  errorDiv.style.display = message ? "block" : "none";
  document.getElementById(fieldId).classList.toggle("is-invalid", !!message);
}

function clearErrors(formId) {
  const form = document.getElementById(formId);
  form.querySelectorAll(".invalid-feedback").forEach((errorDiv) => {
    errorDiv.style.display = "none";
  });
  form.querySelectorAll(".form-control").forEach((input) => {
    input.classList.remove("is-invalid");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors("login-form");
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      login(email, password);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors("signup-form");
      const userName = document.getElementById("signup-userName").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm-password").value;
      const role = document.querySelector('input[name="role"]:checked')?.value || "customer";
      signup(userName, email, password, confirmPassword, role);
    });
  }

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });
});

function login(email, password) {
  try {
    if (!validateEmail(email)) {
      showError("login-email", "Please enter a valid email address.");
      return;
    }

    if (!password) {
      showError("login-password", "Password cannot be empty.");
      return;
    }

    const user = UserManager.getUserByEmail(email);
    if (user && user.password === password) {
      StorageManager.save("currentUser", user);
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
      showError("login-email", "Invalid email or password.");
      showError("login-password", "Invalid email or password.");
    }
  } catch (error) {
    showError("login-email", error.message);
  }
}

function signup(userName, email, password, confirmPassword, role) {
  try {
    if (!validateUserName(userName)) {
      showError("signup-userName", "Username must be at least 3 characters long and contain only letters, numbers, underscores, or hyphens.");
      return;
    }

    if (!validateEmail(email)) {
      showError("signup-email", "Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      showError("signup-password", "Password must be at least 8 characters long, including uppercase, lowercase, and a number.");
      return;
    }

    if (password !== confirmPassword) {
      showError("signup-confirm-password", "Passwords do not match.");
      return;
    }

    if (UserManager.getUserByEmail(email)) {
      showError("signup-email", "Email already exists.");
      return;
    }

    UserManager.createUser(userName, email, password, role);
    showToast("Sign up successful! Please log in.", "success");
    bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
    document.getElementById("signup-userName").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
    document.getElementById("signup-confirm-password").value = "";
    document.querySelector('input[name="role"][value="customer"]').checked = true;
    openLoginModal(email);
  } catch (error) {
    showError("signup-email", error.message);
  }
}

window.openLoginModal = (email = "") => {
  clearErrors("login-form");
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  if (email) {
    document.getElementById("login-email").value = email;
  }
  loginModal.show();
};

window.openSignupModal = () => {
  clearErrors("signup-form");
  new bootstrap.Modal(document.getElementById("signupModal")).show();
};

window.logout = () => {
  StorageManager.remove("currentUser");
  showToast("Logged out successfully!", "success");
  updateNavbar();
  window.location.href = "/index.html";
};