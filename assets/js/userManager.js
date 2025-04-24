import { StorageManager } from "./storageManager.js";

export class User {
  constructor(id, userName, email, password, role) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export class UserManager {
  static createUser(userName, email, password, role) {
    console.log(
      "createUser: Attempting to create user with userName:",
      userName,
      "email:",
      email,
      "role:",
      role
    );
    // Validate inputs
    if (!userName || !email || !password || !role) {
      console.error(
        "createUser: userName, email, password, and role are required."
      );
      throw new Error("userName, email, password, and role are required.");
    }
    const validRoles = ["customer", "seller", "admin"];
    if (!validRoles.includes(role)) {
      console.error("createUser: Invalid role:", role);
      throw new Error("Invalid role. Must be customer, seller, or admin.");
    }

    // Check if email already exists
    const exists = UserManager.getUserByEmail(email);
    if (exists) {
      console.error("createUser: Email already registered:", email);
      throw new Error("Email already registered.");
    }

    const id = Date.now();
    const user = new User(id, userName, email, password, role);
    let users = StorageManager.load("users") || [];
    users.push(user);
    StorageManager.save("users", users);
    console.log("createUser: User created successfully:", user);
    return user;
  }

  static getUser(id) {
    console.log("getUser: Fetching user with id:", id);
    const users = StorageManager.load("users") || [];
    const user = users.find((user) => user.id === id);
    console.log("getUser: Found user:", user);
    return user;
  }
  static getUserNameById(id) {
    console.log("getUserNameById: Fetching username for id:", id);
    const user = UserManager.getUser(id);
    return user ? user.userName : null;
  }
  static getUserByEmail(email) {
    console.log("getUserByEmail: Fetching user with email:", email);
    const users = StorageManager.load("users") || [];
    const user = users.find((user) => user.email === email);
    console.log("getUserByEmail: Found user:", user);
    return user;
  }

  static updateUser(id, userName, email, password, role) {
    console.log("updateUser: Updating user with id:", id);
    let users = StorageManager.load("users") || [];
    users = users.map((user) =>
      user.id === id ? new User(id, userName, email, password, role) : user
    );
    StorageManager.save("users", users);
    console.log("updateUser: User updated successfully:", {
      id,
      userName,
      email,
      role,
    });
  }

  static deleteUser(id) {
    console.log("deleteUser: Deleting user with id:", id);
    let users = StorageManager.load("users") || [];
    users = users.filter((user) => user.id !== id);
    StorageManager.save("users", users);
    console.log("deleteUser: User deleted successfully:", id);
  }

  static getAllUsers() {
    console.log("getAllUsers: Fetching all users");
    const users = StorageManager.load("users") || [];
    console.log("getAllUsers: Found users:", users);
    return users;
  }

  static initializeDefaultAdmin() {
    const adminUserName = "AdminUser";
    const adminEmail = "admin@ecommerce.com";
    const adminPassword = "admin123";
    const adminRole = "admin";

    console.log("initializeDefaultAdmin: Checking for default admin");
  //   const exists = UserManager.getUserByEmail(adminEmail);
  //   if (!exists) {
  //     UserManager.createUser(
  //       adminUserName,
  //       adminEmail,
  //       adminPassword,
  //       adminRole
  //     );
  //     console.log("initializeDefaultAdmin: Default admin created");
  //   } else {
  //     console.log("initializeDefaultAdmin: Default admin already exists");
  //   }
  }
}

function initializeDefaultSellers() {
  const defaultUsers = [
    {
      id: 1,
      userName: "AdminUser",
      email: "admin@ecommerce.com",
      password: "admin123",
      role: "admin",
    },
    {
      id: 2,
      userName: "SellerOne",
      email: "seller1@ecommerce.com",
      password: "seller123",
      role: "seller",
    },
    {
      id: 3,
      userName: "SellerTwo",
      email: "seller2@ecommerce.com",
      password: "seller123",
      role: "seller",
    },
    {
      id: 4,
      userName: "SellerThree",
      email: "seller3@ecommerce.com",
      password: "seller123",
      role: "seller",
    },
  ];

  if (!StorageManager.load("users")) {
    StorageManager.save("users", defaultUsers);
    console.log("initializeDefaultSellers: Default users initialized");
  }
}
initializeDefaultSellers();
