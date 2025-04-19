document.getElementById("signup-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = "customer";

  const newUser = { email, password, role };

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find((user) => user.email === email);
  if (exists) {
    alert("Email already registered!");
    return;
  }

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");
  window.location.href = "login.html";
});


document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Email:", email, "Password:", password);
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  console.log("Users:", users);
  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  if (user.role === "customer") {
    window.location.href = "index.html";
  } else if (user.role === "seller") {
    window.location.href = "seller/dashboard.html";
  } else if (user.role === "admin") {
    window.location.href = "admin/dashboard.html";
  }
});
