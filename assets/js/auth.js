import { UserManager } from "./userManager.js";
import { StorageManager } from "./storageManager.js";
import { showToast } from "./toast.js";

document
  .getElementById("signup-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const role = "customer";

    const exists = UserManager.getUserByEmail(email);
    if (exists) {
      showToast("Email already registered!", "error");
      return;
    }

    UserManager.createUser(email, password, role);
    showToast("Account created successfully!", "success");

    window.location.href = "/index.html";
  });

document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  console.log("Email:", email, "Password:", password);
  const user = UserManager.getUserByEmail(email);

  console.log("User:", user);
  if (!user || user.password !== password) {
    showToast("Invalid email or password!", "error");
    return;
  }

  StorageManager.save("currentUser", user);

  if (user.role === "customer") {
    window.location.href = "/index.html";
  } else if (user.role === "seller") {
    window.location.href = "/seller/dashboard.html";
  } else if (user.role === "admin") {
    window.location.href = "/admin/dashboard.html";
  }
});
